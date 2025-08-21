import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/adminAuthStore';
import Logo from '../assets/logo.png';

const Dashboard = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [overview, setOverview] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messageCounts, setMessageCounts] = useState({ studentCount: 0, botCount: 0 });
  const [sentimentSummary, setSentimentSummary] = useState({ positive: 0, negative: 0, neutral: 0 });
  const [isSessionExpired, setIsSessionExpired] = useState(false);


  // set window title
  window.document.title = "Analytics Dashboard - Themchar AI";

  useEffect(() => {
    fetchSessionOverview();
    fetchSessions();
    
  }, []);

  const fetchSessionOverview = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOverview(res.data);
      console.log('Session Overview:', res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('Session expired, redirecting to login...');
        setIsSessionExpired(true);
      }
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data.all);
      console.log('Sessions:', res.data.all);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSessionSelect = async (sessionId) => {
    setSelectedSession(sessionId);

    try {
      // Fetch message counts
      const msgRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/sessions/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Message count data:", msgRes.data);
      setMessageCounts(msgRes.data);

      // Fetch sentiment summary
      const sentimentRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/sessions/${sessionId}/sentiment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSentimentSummary(sentimentRes.data.summary);
    } catch (err) {
      console.error("Error fetching session analytics:", err);
        if (err.response && err.response.status === 401) {
        console.log('Session expired, redirecting to login...');
        setIsSessionExpired(true);
      }
    }
  };

  return (
    <div className="dashboard">


      {/* Topbar */}
      <header className="topbar">
        <div className="flex column-gap  items-center justify-between">
        <img src={Logo} alt="themchar ai"   height="33px" />
        

        </div>
        <div className="flex column-gap">
          <p className="user"><b>Signed in as: </b>{user?.email ?? '-'}</p>
        <button className="btn-c" onClick={logout}>Logout</button>
        <h1></h1>

        </div>
      </header>
      <div className="mb-2 flex justify-between">
        <h2>Analytics Dashboard</h2>
      
      </div>

      <div className="dashboard-content">
          {/* Counsellor Modal */}
      {isSessionExpired && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 >Session Expired</h2>
            <p>Your session has expired. Please login again </p>
            <button className="btn-a mt-2" onClick={logout}>
              Go to Login
            </button>
          </div>
        </div>
      )}
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="card total">
            <h4>Total Sessions</h4>
            <p>{overview?.total ?? 0}</p>
          </div>
          <div className="card active">
            <h4>Active Sessions</h4>
            <p>{overview?.active ?? 0}</p>
          </div>
          <div className="card closed">
            <h4>Closed Sessions</h4>
            <p>{overview?.closed ?? 0}</p>
          </div>
        </div>

     {/* Session Analytics */}
        {selectedSession && (
          <div className="analytics-container">
            <h3>Session {selectedSession} Analytics</h3>
            <div className="analytics-cards">
              <div className="card message-counts">
                <h4>Message Counts</h4>
                <p>Student: {messageCounts.studentCount}</p>
                <p>Bot: {messageCounts.botCount}</p>
              </div>
              <div className="card sentiment-summary">
                <h4>Sentiment Summary</h4>
                <p>Positive: {sentimentSummary.positive}</p>
                <p>Negative: {sentimentSummary.negative}</p>
                <p>Neutral: {sentimentSummary.neutral}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="sessions-container">
          <h3>Sessions</h3>
          {sessions && (

            <>
              
          
              <ul className="sessions-list">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className={selectedSession === session.id ? 'selected' : ''}
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    <div className="flex column-gap justify-between">
                        <p>{session.title || `Session ${session.id}`}</p>
                      <div className="flex column-gap">
                        {/* <p><b>Start Date:</b> {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : '-'}</p> */}
                        <p className="capitalize s"> {session.status ?? '-'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

   
      </div>
    </div>
  );
};

export default Dashboard;
