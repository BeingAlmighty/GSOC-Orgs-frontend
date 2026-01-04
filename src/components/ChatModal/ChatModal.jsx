import { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getSuggestedQuestions } from '../../api/chat';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, orgName, orgData }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && orgName) {
            loadSuggestions();
            // Add welcome message
            if (messages.length === 0) {
                setMessages([{
                    role: 'assistant',
                    content: `Hi! I'm here to help you learn about ${orgName} and their Google Summer of Code participation. Feel free to ask me anything about our projects, technologies, how to get started contributing, or tips for your GSoC application!`
                }]);
            }
        }
    }, [isOpen, orgName]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadSuggestions = async () => {
        try {
            const response = await getSuggestedQuestions(orgName);
            setSuggestions(response.data?.suggestions || []);
        } catch (err) {
            console.error('Failed to load suggestions:', err);
        }
    };

    const handleSend = async (messageText = inputValue) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = { role: 'user', content: messageText.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            // Send only user messages for the API
            const userMessages = newMessages
                .filter(m => m.role === 'user')
                .map(m => ({ role: 'user', content: m.content }));

            // Add the last assistant messages for context
            const contextMessages = [];
            for (let i = newMessages.length - 1; i >= 0 && contextMessages.length < 10; i--) {
                contextMessages.unshift(newMessages[i]);
            }

            const response = await sendChatMessage(orgName, contextMessages.filter(m => m.role === 'user'));
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data?.content || 'Sorry, I could not generate a response.'
            }]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get response. Please try again.');
            // Remove the user message if there was an error
            setMessages(messages);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: `Hi! I'm here to help you learn about ${orgName} and their Google Summer of Code participation. Feel free to ask me anything about our projects, technologies, how to get started contributing, or tips for your GSoC application!`
        }]);
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="chat-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-avatar">
                            {orgData?.logo ? (
                                <img src={orgData.logo} alt={orgName} />
                            ) : (
                                <span>{orgName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="chat-header-text">
                            <h3>Chat with {orgName}</h3>
                            <span className="chat-subtitle">Powered by Gemini AI</span>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <button className="chat-clear-btn" onClick={clearChat} title="Clear chat">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                        <button className="chat-close-btn" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.role}`}>
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-content loading">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="chat-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length <= 1 && suggestions.length > 0 && (
                    <div className="chat-suggestions">
                        <p>Suggested questions:</p>
                        <div className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <button 
                                    key={index} 
                                    className="suggestion-btn"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="chat-input-container">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask about ${orgName}...`}
                        disabled={isLoading}
                        rows={1}
                    />
                    <button 
                        className="chat-send-btn" 
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>

                <div className="chat-disclaimer">
                    AI responses are generated and may not be 100% accurate. Verify important information.
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
