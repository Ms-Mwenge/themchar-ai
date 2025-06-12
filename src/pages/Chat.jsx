import {React, useEffect, useState, useRef } from 'react';

import MessageBubble from '../components/MessageBubble.jsx'; 


const Chat = () => {

    const [showSidebar, setShowSidebar] = useState(true);
    const [messageCount, setMessageCount] = useState(0);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

     // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Dependency on messages array

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const currentUser = {
        id: "user123",
        name: "You",
    };

    // Simulated chatbot response
    const simulateBotResponse = (userMessage) => {
        // This is where you would normally call your API
        // For simulation, we'll return a canned response after a delay
        const botResponses = [
            "I understand what you're saying.",
            "That's an interesting point!",
            "Let me think about that...",
            "Thanks for sharing that with me.",
            "Could you elaborate on that?",
        ];
        
        return {
            id: Date.now(),
            text: botResponses[Math.floor(Math.random() * botResponses.length)],
            timestamp: new Date().toISOString(),
            senderId: "chatbot",
            senderName: "ChatBot",
        };
    };

    // 🔌 API CONNECTION POINT - Replace this with your actual API call
    const sendMessageToAPI = async (message) => {
        // Simulate API delay
        setIsWaitingForResponse(true);
        
        try {
            // 🚀 REAL API CALL WOULD GO HERE
            // const response = await fetch('your-api-endpoint', {
            //     method: 'POST',
            //     body: JSON.stringify(message),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // const data = await response.json();
            // return data;
            
            // For now, we'll simulate a response
            await new Promise(resolve => setTimeout(resolve, 1500));
            return simulateBotResponse(message);
        } catch (error) {
            console.error("API Error:", error);
            return {
                id: Date.now(),
                text: "Sorry, I'm having trouble connecting.",
                timestamp: new Date().toISOString(),
                senderId: "chatbot",
                senderName: "ChatBot (Error)",
            };
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || isWaitingForResponse) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage,
            timestamp: new Date().toISOString(),
            senderId: currentUser.id,
            senderName: currentUser.name,
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");
        setMessageCount(prev => prev + 1);

        // Get and add bot response
        const botResponse = await sendMessageToAPI(userMessage);
        setMessages(prev => [...prev, botResponse]);
    };


    return (
        <>
        <section className="chat flex">
            <aside className="chat-sidebar">
                <div className={`col-1 ${showSidebar ? 'show' : 'hide'}`}>
                    <h3>Chat History</h3>
                    <ul>
                        <li>Random titles that i generated for my UI.</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                        <li>Random titles</li>
                    </ul>
                </div>

                <div className="col-2">
                    <div
                        onClick={toggleSidebar}
                        className="sidebar-btn"
                        
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#a5a5a5" className="bi bi-layout-sidebar" viewBox="0 0 16 16">
                            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"/>
                        </svg>
                    </div>
                </div>


            </aside>
            <aside className="chat-main-panel">
                <div className="messages">
                   {messageCount > 0 ?  (
                         <div class="chat-room">

                           {messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} isSender={msg.senderId === currentUser.id} />
                            ))}

                            {isWaitingForResponse && (
                                <div className="message-row receiver">
                                    <div className="message-bubble loading">
                                        <div className="loader"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} /> {/* This invisible div acts as our scroll target */}

                        </div>
                      ) : (
                        
                        <div>
                            <h2>Hello, what's on your mind today?</h2>
                            <p> Start a conversation by typing a message below.</p>
                        </div>
                        )
                    }

                </div>
                <div className="container">
                    <div className="chat-input">
                        <input 
                            type="text" 
                              value={newMessage} 
                            placeholder="Type your message..." 
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                         <div
                        onClick={handleSend}
                        className="send-btn"
                        >
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                            </svg>
                   </div>
                </div>
                </div>
                 
                 <p className="caution"><b>Caution:</b> Information provided by Themchar AI might be inaccurate, kindly verify.</p>

            </aside>
        </section>
        </>
    );
    }
export default Chat;