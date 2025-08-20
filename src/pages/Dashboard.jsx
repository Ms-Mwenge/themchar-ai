import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/adminAuthStore';
import Logo from '../assets/logo.png';

const Dashboard = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [overview, setOverview] = useState({ total: 0, active: 0, closed: 0 });
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messageCounts, setMessageCounts] = useState({ studentCount: 0, botCount: 0 });
  const [sentimentSummary, setSentimentSummary] = useState({ positive: 0, negative: 0, neutral: 0 });

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
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSessionSelect = async (sessionId) => {
    setSelectedSession(sessionId);

    try {
      // Fetch message counts
      const msgRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/message-counts/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessageCounts(msgRes.data);

      // Fetch sentiment summary
      const sentimentRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/sentiment-summary/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSentimentSummary(sentimentRes.data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      {/* Topbar */}
      <header className="topbar">
        <img src={Logo} alt="themchar ai" className="logo" />
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <div className="dashboard-content">
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="card total">
            <h4>Total Sessions</h4>
            <p>{overview.total}</p>
          </div>
          <div className="card active">
            <h4>Active Sessions</h4>
            <p>{overview.active}</p>
          </div>
          <div className="card closed">
            <h4>Closed Sessions</h4>
            <p>{overview.closed}</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="sessions-container">
          <h3>Sessions</h3>
          <ul className="sessions-list">
            {sessions.map((session) => (
              <li
                key={session.id}
                className={selectedSession === session.id ? 'selected' : ''}
                onClick={() => handleSessionSelect(session.id)}
              >
                {session.title || `Session ${session.id}`}
              </li>
            ))}
          </ul>
        </div>

        {/* Session Analytics */}
        {selectedSession && (
          <div className="analytics-container">
            <h3>Session Analytics</h3>
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
      </div>
    </div>
  );
};

export default Dashboard;
