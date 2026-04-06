import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Register = () => {

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/register', {
            username,
            password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/login')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-base">
            <div className="bg-surface border border-border rounded-[10px] p-12 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-text-primary mb-8 tracking-tight">Create Account</h2>
                <form
                    onSubmit={submitHandler}
                >
                    <div className="mb-6">
                        <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="email">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)} s
                            type="password"
                            id="password"
                            className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-[8px] bg-accent text-base font-medium hover:bg-accent-hover focus:outline-none transition"
                    >
                        Register
                    </button>
                </form>
                <p className="text-text-secondary text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-accent hover:text-accent-hover transition">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register