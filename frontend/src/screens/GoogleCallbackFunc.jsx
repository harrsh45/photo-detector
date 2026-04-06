import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const GoogleCallbackFunc = () => {
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
        console.log("Token from Google login:", token);
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
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="bg-surface border border-border rounded-[10px] p-12 w-96 text-center">
        <h1 className="text-text-primary text-2xl font-semibold mb-6 tracking-tight">Processing Login</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-elevated border-t-accent"></div>
        </div>
        <p className="text-text-secondary text-sm mt-6">Please wait while we complete your Google login...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackFunc;