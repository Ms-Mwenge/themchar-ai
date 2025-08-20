import React, { useState } from 'react';
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

  // Modal state
  const [isCounsellorModalOpen, setCounsellorModalOpen] = useState(false);
  const [isTestModalOpen, setTestModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/end/${chatSessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <nav className="flex navbar">
        <div className="logo">
          <img src={Logo} alt="themchar ai" width="221" />
        </div>

        <div className="nav-links flex column-gap">
          <div className="buttons flex column-gap">
            {
              user && 
              <div className="flex column-gap">
              {/* Counsellor Contact Modal Trigger */}
              <button
                className="btn-a"
                onClick={() => setCounsellorModalOpen(true)}
              >
                Contact Counsellor
              </button>

              {/* PHQ-9 Test Modal Trigger */}
              <button className="btn-b" onClick={() => setTestModalOpen(true)}>
                Take Depression Test
              </button>
            </div>
            }
            {user ? (
              <button className="btn-c" onClick={handleLogout}>
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

      {/* Counsellor Modal */}
      {isCounsellorModalOpen && (
        <div className="modal-overlay" onClick={() => setCounsellorModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Affiliated Counselling service</p>
            <h2 className="upper">PsychCare Counseling Network</h2>
            <p><b>Email:</b> life101counselling@gmail.com</p>
            <p> <b>Phone:</b> +260 77 018 1353 </p>
            <button className="btn-a mt-2" onClick={() => setCounsellorModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* PHQ-9 Test Modal */}
      {isTestModalOpen && (
        <div className="modal-overlay" onClick={() => setTestModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>PHQ-9 Depression Self-Test</h2>
            <hr />
            <p>Please answer the following questions honestly. For answers get in touch with our coursellors</p>
            <hr />
            <ul className="phq-questions">
              <li>Little interest or pleasure in doing things?</li>
              <li>Feeling down, depressed, or hopeless?</li>
              <li>Trouble falling or staying asleep, or sleeping too much?</li>
              <li>Feeling tired or having little energy?</li>
              <li>Poor appetite or overeating?</li>
              <li>Feeling bad about yourself or that you are a failure?</li>
              <li>Trouble concentrating on things?</li>
              <li>Moving/speaking slowly or being restless?</li>
              <li>Thoughts of hurting yourself?</li>
            </ul>
            <button className="btn-a mt-2" onClick={() => setTestModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
