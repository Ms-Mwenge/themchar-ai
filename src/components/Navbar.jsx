import React from 'react';
import Logo from '../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const chatSessionId = useAuthStore((state) => state.chatSessionId);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

          //   end chat session
         const endChatResponse = await axios.post(
         `${process.env.REACT_APP_API_URL}/chat/end/${chatSessionId}`,
         {},
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
         );

         console.log('Chat session ended:', endChatResponse.data);

         
       // Call backend to invalidate token
         await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/logout`,
            {}, // no body needed
            {
            headers: {
               Authorization: `Bearer ${token}`, // include token here
            },
            }
         );

         // console
         console.log('Logout successful');

     

         // Clear Zustand store and localStorage
         logout();

         // Redirect to login
         navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      // Optionally still clear local session even if backend fails
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="flex">
      <div className="logo">
        <img src={Logo} alt="themchar ai" width="221" />
      </div>

      <div className="nav-links flex column-gap">
        <div className="buttons flex column-gap">
          {user ? (
            <button className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="btn-primary">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
