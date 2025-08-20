import { React, useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import MessageBubble from '../components/MessageBubble.jsx';
import axios from 'axios';

import { processMessageSentiment, shouldBlockSession, shouldShowCounsellor } from '../utils/sentimentTracker';

const Chat = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const [showCounsellorAlert, setShowCounsellorAlert] = useState(false);
    const [isSessionBlocked, setIsSessionBlocked] = useState(false);

        // Check sentiment status on component mount
        useEffect(() => {
            setIsSessionBlocked(shouldBlockSession());
            setShowCounsellorAlert(shouldShowCounsellor());
        }, []);



    useEffect(() => { scrollToBottom(); }, [messages]);

    // Get current user and chat session from Zustand
    const currentUser = useAuthStore(state => state.user);
    const chatSessionId = useAuthStore(state => state.chatSessionId);
    const token = useAuthStore(state => state.token);

    // 🔍 Fetch all chat sessions when component mounts
    useEffect(() => {
        const fetchChatSessions = async () => {
            if (!token) return;
            
            setIsLoadingSessions(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/chat/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setChatSessions(response.data.sessions);
                }
            } catch (error) {
                console.error('Failed to fetch chat sessions:', error);
            } finally {
                setIsLoadingSessions(false);
            }
        };

        fetchChatSessions();
    }, [token]);

    // 🔍 Load messages for the current session when component mounts or session changes
    useEffect(() => {
        if (chatSessionId) {
            loadSessionMessages(chatSessionId);
            setSelectedSessionId(chatSessionId);
        }
    }, [chatSessionId]);

    // Load messages for a specific session
    const loadSessionMessages = async (sessionId) => {
        setIsLoadingMessages(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/chat/history/${sessionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const { messages: sessionMessages } = response.data;
                
                // Transform messages to frontend format
                const formattedMessages = sessionMessages.map(msg => ({
                    id: msg.id,
                    text: msg.text || msg.content,
                    senderId: msg.sender === 'bot' ? 'bot' : currentUser.id,
                    senderName: msg.sender === 'bot' ? 'ChatBot' : currentUser.name,
                    timestamp: msg.createdAt || msg.timestamp,
                    sessionId: sessionId
                }));

                setMessages(formattedMessages);
                setSelectedSessionId(sessionId);
            }
        } catch (error) {
            console.error('Failed to fetch session messages:', error);
            // If it's the current session and no messages exist yet, set empty array
            if (sessionId === chatSessionId) {
                setMessages([]);
                setSelectedSessionId(sessionId);
            }
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // 🔌 Send message API call
    const sendMessageToAPI = async (text) => {
        setIsWaitingForResponse(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/chat/send`,
                { sessionId: selectedSessionId || chatSessionId, text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (res.status !== 200 && res.status !== 201) throw new Error('Failed to send message');

            // log response
            console.log('API Response:', res.data);
            return res.data;
        } catch (err) {
            console.error('API Error:', err);
            return {
                student: {
                    id: Date.now(),
                    text,
                    sender: 'student',
                    createdAt: new Date().toISOString()
                },
                bot: {
                    id: Date.now() + 1,
                    text: "Sorry, I couldn't reach the server.",
                    sender: 'bot',
                    createdAt: new Date().toISOString()
                }
            };
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    const handleSend = async () => {
           if (!newMessage.trim() || isWaitingForResponse || isSessionBlocked) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: new Date().toISOString(),
            sessionId: selectedSessionId || chatSessionId
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");

        const data = await sendMessageToAPI(userMessage.text);
          // Process sentiment from bot response if available
        if (data.bot && data.bot.sentiment) {
        const sentimentResult = processMessageSentiment(data.bot);
        if (sentimentResult) {
            setIsSessionBlocked(sentimentResult.isSessionBlocked);
            setShowCounsellorAlert(sentimentResult.shouldShowCounsellor);
        }
        }

        // Process sentiment from student message
        const studentSentimentResult = processMessageSentiment(data.student);
        if (studentSentimentResult) {
        setIsSessionBlocked(studentSentimentResult.isSessionBlocked);
        setShowCounsellorAlert(studentSentimentResult.shouldShowCounsellor);
        }

        const studentMsg = {
            id: data.student.id,
            text: data.student.text,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: data.student.createdAt,
            sessionId: selectedSessionId || chatSessionId
        };
        const botMsg = {
            id: data.bot.id,
            text: data.bot.text,
            senderId: 'bot',
            senderName: 'ChatBot',
            timestamp: data.bot.createdAt,
            sessionId: selectedSessionId || chatSessionId
        };

        setMessages(prev => [...prev, botMsg]);

        // Refresh sessions list to include the new message
        if (token) {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/chat/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChatSessions(response.data.sessions);
            }
        }
    };

    // Format date for display
    const formatSessionDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const isCurrentSession = (sessionId) => {
        return sessionId === chatSessionId;
    };

    // handle show counselor modal

const handleConnect = () => {
  const subject = encodeURIComponent("Professional Counselling Support Request - ThemcharAI");
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=life101counselling@gmail.com&su=${subject}`;

  window.open(gmailLink, "_blank"); // opens Gmail compose in new tab
  setShowCounsellorAlert(false);
 
};



    return (
        <section className="chat flex">
            <aside className="chat-sidebar">
            <div className={`col-1 ${showSidebar ? 'show' : 'hide'}`}>
                {/* Header with title and toggle button */}
                <div className="chat-sidebar-header">
                    <h3>Chat Sessions</h3>
                    <div onClick={toggleSidebar} className="sidebar-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#666" viewBox="0 0 16 16">
                            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"/>
                        </svg>
                    </div>
                </div>

            {/* Scrollable session list */}
            <ul className="chat-sessions-list">
            {isLoadingSessions ? (
                <div className="loading-history">
                <div className="loader small"></div>
                <span>Loading sessions...</span>
                </div>
            ) : (
                <>
                {/* Current active session */}
                <li
                    className={`chat-session-item ${selectedSessionId === chatSessionId ? 'active' : ''} current-session`}
                    onClick={() => loadSessionMessages(chatSessionId)}
                >
                    <div className="session-preview">
                    <p className="session-title">Current Chat</p>
                    <p className="session-time">
                        Started: {formatSessionDate(new Date().toISOString())}
                    </p>
                    </div>
                </li>

                {/* Previous sessions */}
                {chatSessions.filter(session => session.messageCount > 0).length > 0 ? (
                    chatSessions
                    .filter(session => session.messageCount > 0)
                    .map(session => (
                        <li
                        key={session.id}
                        className={`chat-session-item ${session.id === selectedSessionId ? 'active' : ''}`}
                        onClick={() => loadSessionMessages(session.id)}
                        >
                        <div className="session-preview">
                            <p className="session-title">{session.title}</p>
                            <p className="session-message-count">
                            {session.messageCount} {session.messageCount === 1 ? 'message' : 'messages'}
                            </p>
                        </div>
                        </li>
                    ))
                ) : (
                    <li className="no-sessions">No previous chat sessions</li>
                )}
                </>
            )}
            </ul>
            </div>
            
            {/* Mobile toggle button (hidden on desktop) */}
            {!showSidebar && (
                <div onClick={toggleSidebar} className="sidebar-toggle mobile-only">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#666" viewBox="0 0 16 16">
                        <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"/>
                    </svg>
                </div>
            )}
        </aside>
            <aside className="chat-main-panel">
                {showCounsellorAlert &&
                   <div className="alert-overlay">
                     <div className="c-alert">
                        <h3>See a Counsellor</h3>
                        <p>We recommend speaking with a mental health professional. Your mental health is important,
                             and we're here to help you connect with the right resources.</p>
                        <div>
                            <button onClick={() => setShowCounsellorAlert(false)} className="btn-a">Dismiss</button>
                            <button onClick={handleConnect} className="btn-b">Connect</button>
                        </div>
                    </div>
                   </div>
                }
                {isLoadingMessages ? (
                    <div className="loading-messages">
                        <div className="loader"></div>
                        <span>Loading messages...</span>
                    </div>
                ) : (
                    <>
                        <div className="messages">
                            {messages.length > 0 ? (
                                <div className="chat-room">
                                    {messages.map(msg => (
                                        <MessageBubble
                                            key={msg.id}
                                            message={msg}
                                            isSender={msg.senderId === currentUser.id}
                                        />
                                    ))}
                                    {isWaitingForResponse && (
                                        <div className="message-row receiver">
                                            <div className="message-bubble loading">
                                                <div className="loader"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : selectedSessionId === chatSessionId ? (
                                <div className="empty-chat">
                                    <h2>What's on your mind today?</h2>
                                    <p>Start a conversation by typing a message below.</p>
                                </div>
                            ) : (
                                <div className="empty-chat">
                                    <h2>No messages in this session</h2>
                                    <p>This chat session doesn't have any messages yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="container">
                            <div className="chat-input">
                                  <input
                                        type="text"
                                        value={newMessage}
                                        placeholder={isSessionBlocked ? "Session paused. Please seek professional help." : "Type your message..."}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        disabled={isWaitingForResponse || isSessionBlocked}
                                    />
                                <div
                                    onClick={handleSend}
                                    className={"send-btn" + (isWaitingForResponse ? "-disabled" :isSessionBlocked ? "-disabled" :"")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-send-fill" viewBox="0 0 16 16">
                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <p className="caution">
                    <b>Caution:</b> Information provided by Themchar AI might be inaccurate, kindly verify.
                </p>
            </aside>
        </section>
    );
};

export default Chat;