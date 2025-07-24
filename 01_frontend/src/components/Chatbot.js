import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m an AI assistant powered by Ollama running locally. Ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  // Check backend connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkConnection = async () => {
    try {
      const response = await axios.get(`${backendUrl}/health`);
      setIsConnected(response.data.status === 'healthy');
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/chat`, {
        message: userMessage.content,
        conversation_history: messages
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running and try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m an AI assistant powered by Ollama running locally. Ask me anything!'
      }
    ]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Chat Interface</h2>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            ●
          </span>
          <span>{isConnected ? 'Connected to Backend' : 'Backend Disconnected'}</span>
          <button onClick={checkConnection} className="refresh-btn">
            🔄
          </button>
          <button onClick={clearChat} className="clear-btn">
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-role">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-role">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send)"
          disabled={isLoading || !isConnected}
          rows="3"
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !isConnected || !input.trim()}
          className="send-btn"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
