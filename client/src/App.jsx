import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('detector'); // 'detector' or 'chat'

  const detectFakeNews = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/detect-fake-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'user',
        content: text,
        timestamp: new Date()
      }, {
        type: 'bot',
        content: result,
        timestamp: new Date()
      }]);

      setText('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to analyze the news. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!text.trim()) return;

    const userMessage = text;
    setText('');
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const result = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: { response: result.response },
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'detector') {
      detectFakeNews();
    } else {
      sendChatMessage();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FakeSpotter AI</h1>
        <p>AI-powered fake news detection using Groq</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'detector' ? 'active' : ''}`}
          onClick={() => setActiveTab('detector')}
        >
          News Detector
        </button>
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat Assistant
        </button>
      </div>

      <main className="main-content">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              {activeTab === 'detector' ? (
                <>
                  <h3>Welcome to FakeSpotter</h3>
                  <p>Paste any news headline or article below to check if it's real or fake.</p>
                </>
              ) : (
                <>
                  <h3>Chat with FakeSpotter AI</h3>
                  <p>Ask me anything about fake news, media literacy, or how to spot misinformation.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="clear-button-container">
                <button onClick={clearMessages} className="clear-button">
                  Clear History
                </button>
              </div>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  {message.type === 'user' && (
                    <div className="message-content">
                      <strong>You:</strong>
                      <p>{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'bot' && activeTab === 'detector' && (
                    <div className="message-content detection-result">
                      <strong>FakeSpotter Analysis:</strong>
                      <div className={`verdict ${message.content.verdict?.toLowerCase()}`}>
                        <h3>
                          {message.content.verdict}
                        </h3>
                        <div className="confidence">
                          Confidence: {message.content.confidence}%
                        </div>
                      </div>
                      <div className="explanation">
                        <strong>Explanation:</strong>
                        <p>{message.content.explanation}</p>
                      </div>
                    </div>
                  )}

                  {message.type === 'bot' && activeTab === 'chat' && (
                    <div className="message-content">
                      <strong>FakeSpotter AI:</strong>
                      <p>{message.content.response}</p>
                    </div>
                  )}

                  {message.type === 'error' && (
                    <div className="message-content error">
                      <strong>Error:</strong>
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {isLoading && (
            <div className="message bot loading">
              <div className="message-content">
                <strong>FakeSpotter AI:</strong>
                <p>Analyzing... Please wait.</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                activeTab === 'detector' 
                  ? "Paste news headline or article here..." 
                  : "Ask me about fake news detection..."
              }
              rows={4}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !text.trim()}>
              {isLoading ? 'Loading...' : activeTab === 'detector' ? 'Analyze' : 'Send'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
