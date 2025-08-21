import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logo from '../assets/logo.png';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // set window title
  window.document.title = "Login - Themchar AI";

//   log url from .env
console.log('API URL:', process.env.REACT_APP_API_URL);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // Replace with your API endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`, 
        { email, password }
    );
      const { token, user } = response.data.data;

     

      console.log('Login successful:', response.data);
      console.log('token:', token);
      console.log('user:', user);

      //   start and set session
      const startChatResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const chatSessionId = startChatResponse.data.session.id;

      console.log('Chat session started:', startChatResponse.data);
    //   log session id
    console.log('Chat Session ID:', startChatResponse.data.session.id);
       // Update Zustand store
      login(chatSessionId, token, user);

      // Redirect to dashboard or homepage
      navigate('/chat');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="container login-logo">
        <NavLink to="/">
          <img src={Logo} alt="themchar ai" width="221" />
        </NavLink>
      </div>

      <div className="container">
        <div className="login-container">
          <h2>Login</h2>
          <p>Please enter your credentials to continue.</p>
          <br className="mt-1" />

          {error && <p className="error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="mt-2 btn-primary" onClick={handleLogin}>
            Login
          </button>

          <p className="mt-1">
            Don't have an account?{' '}
            <NavLink to="/register">
              <span className="link">Register</span>
            </NavLink>
          </p>

          <p className="caution mt-2">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
