import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
    
    const location = useLocation()

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()
    
    // Check for error parameters in the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorType = params.get('error');
        
        if (errorType === 'google_auth_failed') {
            setError('Google authentication failed. Please try again or use username/password.');
        } else if (errorType === 'no_token') {
            setError('Authentication token not received. Please try again.');
        } else if (errorType === 'callback_error') {
            setError('Error processing login. Please try again.');
        }
    }, [location]);

    function submitHandler(e) {
        e.preventDefault()
        setError('') // Clear previous errors

        axios.post('/users/login', {
            username,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/')
        }).catch((err) => {
            console.log(err.response?.data)
            if (err.response?.status === 401) {
                setError('Incorrect username or password. Please try again or create an account.')
            } else {
                setError('Login failed. Please try again later.')
            }
        })
    }

    const handleGoogleLogin = () => {
        // Redirect to the Google OAuth endpoint
        window.open("https://photo-detector-backend.onrender.com/api/auth/google", "_self")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base">
            <div className="bg-surface border border-border rounded-[10px] p-12 w-full max-w-md">
                <h1 className="text-text-primary text-2xl font-semibold mb-8 tracking-tight">Sign in</h1>
                {error && (
                    <div className="bg-danger-subtle text-danger border border-danger/20 p-4 rounded-[8px] mb-6 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                            id="password"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-accent hover:bg-accent-hover text-base font-medium py-3 px-8 rounded-[8px] focus:outline-none transition"
                            type="submit"
                        >
                            Sign In
                        </button>
                        <Link
                            className="text-sm text-text-secondary hover:text-accent transition"
                            to="/register"
                        >
                            Create an Account
                        </Link>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default Login