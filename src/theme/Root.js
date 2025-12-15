import React, { useEffect, useRef, useState, useCallback } from 'react';

function ChatPanel({ selectedText, onClearSelection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const requestBody = {
        message: { content: userMessage },
      };

      // Include selected text in context if available
      if (selectedText) {
        requestBody.context = { selected_text: selectedText };
      }

      const response = await fetch('https://ai-native-book-sand.vercel.app/chatkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let currentEvent = 'message';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          // Track event type
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              // Handle error events
              if (currentEvent === 'error' && data.error) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg.role === 'assistant') {
                    // Extract user-friendly error message
                    let errorMsg = data.error;
                    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
                      errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
                    } else if (errorMsg.length > 200) {
                      errorMsg = 'An error occurred. Please try again.';
                    }
                    lastMsg.content = errorMsg;
                  }
                  return newMessages;
                });
                continue;
              }

              // Handle message events with delta
              if (data.delta) {
                // Skip tool call JSON strings
                if (!data.delta.startsWith('{') || !data.delta.includes('"query"')) {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                      lastMsg.content += data.delta;
                    }
                    return newMessages;
                  });
                }
              }
            } catch (e) {
              // Ignore JSON parse errors for non-data lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}. Please try again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, selectedText]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Open chat"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '380px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#0066cc',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Book Assistant</span>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Mode indicator */}
      {selectedText && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#e8f4fc',
            borderBottom: '1px solid #cce5ff',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            <strong>Selected text mode:</strong>{' '}
            {selectedText.substring(0, 40)}...
          </span>
          <button
            onClick={onClearSelection}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0066cc',
              fontSize: '12px',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
            {selectedText
              ? 'Ask a question about the selected text'
              : 'Ask a question about the book'}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius: '12px',
                backgroundColor: msg.role === 'user' ? '#0066cc' : '#f0f0f0',
                color: msg.role === 'user' ? 'white' : 'black',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content || (msg.role === 'assistant' && isLoading ? '...' : '')}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={selectedText ? 'Ask about selection...' : 'Ask about the book...'}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 16px',
            backgroundColor: isLoading || !input.trim() ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading || !input.trim() ? 'default' : 'pointer',
            fontSize: '14px',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function Root({ children }) {
  const [selectedText, setSelectedText] = useState('');
  const [showAskButton, setShowAskButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // Text selection detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setButtonPosition({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX + rect.width / 2,
        });
        setShowAskButton(true);
        // Store temporarily for the ask button click
        window.__tempSelectedText = text;
      } else {
        setShowAskButton(false);
      }
    };

    const handleMouseDown = (e) => {
      // Don't hide if clicking the ask button
      if (e.target.closest('[data-ask-button]')) return;
      setShowAskButton(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleAskAboutSelection = () => {
    setSelectedText(window.__tempSelectedText || '');
    setShowAskButton(false);
  };

  const clearSelection = () => {
    setSelectedText('');
  };

  return (
    <>
      {children}

      {/* Ask about selection button */}
      {showAskButton && (
        <button
          data-ask-button
          onClick={handleAskAboutSelection}
          style={{
            position: 'absolute',
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: 'translateX(-50%)',
            padding: '6px 12px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10000,
            whiteSpace: 'nowrap',
          }}
        >
          Ask about selection
        </button>
      )}

      {/* Chat Panel */}
      <ChatPanel selectedText={selectedText} onClearSelection={clearSelection} />
    </>
  );
}
