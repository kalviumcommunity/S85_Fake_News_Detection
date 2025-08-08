import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [examples, setExamples] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('detector');

  // Pre-built examples for multishot prompting
  const sampleExamples = [
    {
      text: "Scientists discover miracle cure that makes people immortal using common household items",
      verdict: "FAKE",
      confidence: 98,
      reasoning: "Extraordinary medical claims without peer review, uses sensational language, promises impossible results"
    },
    {
      text: "Federal Reserve announces 0.25% interest rate increase following inflation concerns",
      verdict: "REAL",
      confidence: 92,
      reasoning: "Standard monetary policy announcement, specific numerical data, aligns with economic patterns"
    }
  ];

  const detectFakeNews = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    const userMessage = {
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/detect-fake-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          examples: [...sampleExamples, ...examples]
        }),
      });

      const result = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: result,
        timestamp: new Date()
      }]);

      setText('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to analyze the news. Please check your connection and try again.',
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
        type: 'assistant',
        content: { response: result.response },
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to send message. Please check your connection and try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addExample = () => {
    if (!text.trim()) return;
    
    // Add as an example (this could be enhanced with a form)
    const newExample = {
      text: text.trim(),
      verdict: "REAL", // Default, could be made interactive
      confidence: 80,
      reasoning: "User provided example"
    };
    
    setExamples(prev => [...prev, newExample]);
    setText('');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const clearExamples = () => {
    setExamples([]);
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
        <p>Advanced multishot prompting for reliable fake news detection</p>
      </header>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'detector' ? 'active' : ''}`}
          onClick={() => setActiveTab('detector')}
        >
          News Detector
        </button>
        <button 
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          AI Assistant
        </button>
      </div>

      <div className="main-layout">
        {activeTab === 'detector' && (
          <div className="examples-panel">
            <h3>Training Examples ({sampleExamples.length + examples.length})</h3>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px'}}>
              Multishot prompting uses these examples to improve accuracy
            </p>
            
            {sampleExamples.map((example, index) => (
              <div key={`sample-${index}`} className="example-item">
                <div className="example-text">"{example.text}"</div>
                <div className="example-meta">
                  <span style={{color: example.verdict === 'REAL' ? 'var(--success)' : 'var(--error)'}}>
                    {example.verdict}
                  </span>
                  <span>{example.confidence}%</span>
                  <span>Built-in</span>
                </div>
              </div>
            ))}
            
            {examples.map((example, index) => (
              <div key={`user-${index}`} className="example-item">
                <div className="example-text">"{example.text}"</div>
                <div className="example-meta">
                  <span style={{color: example.verdict === 'REAL' ? 'var(--success)' : 'var(--error)'}}>
                    {example.verdict}
                  </span>
                  <span>{example.confidence}%</span>
                  <span>Custom</span>
                </div>
              </div>
            ))}

            {examples.length > 0 && (
              <button onClick={clearExamples} className="clear-button" style={{marginTop: '12px'}}>
                Clear Custom Examples
              </button>
            )}
          </div>
        )}

        <div className="messages-container">
          <div className="messages-header">
            <div className="messages-title">
              {activeTab === 'detector' ? 'Analysis Results' : 'AI Conversation'}
            </div>
            {messages.length > 0 && (
              <button onClick={clearMessages} className="clear-button">
                Clear
              </button>
            )}
          </div>

          <div className="messages-body">
            {messages.length === 0 ? (
              <div className="welcome-state">
                {activeTab === 'detector' ? (
                  <>
                    <h3>Ready to Analyze</h3>
                    <p>Paste any news headline or article below. Our multishot prompting system will analyze it using proven examples for better accuracy.</p>
                  </>
                ) : (
                  <>
                    <h3>AI Assistant Ready</h3>
                    <p>Ask me anything about fake news detection, media literacy, or how to identify misinformation.</p>
                  </>
                )}
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-bubble">
                      {message.type === 'user' && (
                        <div className="message-text">{message.content}</div>
                      )}
                      
                      {message.type === 'assistant' && activeTab === 'detector' && (
                        <div>
                          <div className="analysis-result">
                            <div className={`verdict-badge ${message.content.verdict?.toLowerCase()}`}>
                              {message.content.verdict}
                              {message.content.multishotUsed && <span style={{opacity: 0.7}}> • Enhanced</span>}
                            </div>
                            
                            <div className="confidence-bar">
                              <div className="confidence-label">
                                Confidence: {message.content.confidence}%
                              </div>
                              <div className="confidence-track">
                                <div 
                                  className="confidence-fill" 
                                  style={{width: `${message.content.confidence}%`}}
                                />
                              </div>
                            </div>

                            <div className="reasoning">
                              <div className="reasoning-title">Analysis</div>
                              <div className="reasoning-text">
                                {message.content.reasoning || message.content.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.type === 'assistant' && activeTab === 'chat' && (
                        <div className="message-text">
                          {message.content.response}
                        </div>
                      )}

                      {message.type === 'error' && (
                        <div className="message-text" style={{color: 'var(--error)'}}>
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-bubble">
                  <div className="loading-indicator">
                    <span>Analyzing</span>
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="input-section">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <textarea
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                activeTab === 'detector' 
                  ? "Paste news headline or article here for analysis..." 
                  : "Ask me about fake news detection, media literacy, or misinformation..."
              }
              rows={4}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? 'Processing...' : activeTab === 'detector' ? 'Analyze' : 'Send'}
            </button>
          </div>
          
          {activeTab === 'detector' && (
            <button 
              type="button"
              onClick={addExample}
              disabled={!text.trim()}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Add as Training Example
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
