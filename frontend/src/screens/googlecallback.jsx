import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get token from URL query params
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          console.error('Google authentication error:', error);
          navigate('/login?error=google_auth_failed');
          return;
        }

        if (!token) {
          console.error('No token received from Google authentication');
          navigate('/login?error=no_token');
          return;
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Get user data
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Set user in context
        setUser(response.data);

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error handling Google callback:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleGoogleCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 text-center">
        <h1 className="text-white text-2xl font-bold mb-5">Processing Login</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-300 mt-4">Please wait while we complete your Google login...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;