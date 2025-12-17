import React, { useEffect, useRef, useState, useCallback } from 'react';

// Modern ChatPanel with glassmorphism and gradient design
const STORAGE_KEY = 'ai-textbook-chat-history';
const MAX_HISTORY_MESSAGES = 10; // Store last 10 messages in localStorage

function ChatPanel({ selectedText, onClearSelection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed.slice(-MAX_HISTORY_MESSAGES));
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return;
    try {
      const toSave = messages.slice(-MAX_HISTORY_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare history for context (last 8 messages, exclude current)
      const historyForApi = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const requestBody = {
        message: { content: userMessage },
        history: historyForApi,
      };

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

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let currentEvent = 'message';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (currentEvent === 'error' && data.error) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg.role === 'assistant') {
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

              if (data.delta) {
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
              // Ignore JSON parse errors
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

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  // Styles object for the modern design
  const styles = {
    // Floating Action Button (closed state)
    fab: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '64px',
      height: '64px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '28px',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'scale(1)',
    },
    fabHover: {
      transform: 'scale(1.05) translateY(-2px)',
      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5), 0 8px 24px rgba(0, 0, 0, 0.15)',
    },
    // Chat container
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '600px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9998,
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Header
    header: {
      padding: '20px 20px 16px',
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    headerTitle: {
      fontWeight: '700',
      fontSize: '16px',
      letterSpacing: '-0.01em',
    },
    headerSubtitle: {
      fontSize: '12px',
      opacity: 0.85,
      marginTop: '2px',
    },
    headerButtons: {
      display: 'flex',
      gap: '8px',
    },
    headerButton: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    // Selection mode banner
    selectionBanner: {
      padding: '12px 16px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    selectionText: {
      fontSize: '13px',
      color: '#475569',
      flex: 1,
      overflow: 'hidden',
    },
    selectionLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#6366f1',
      fontWeight: '600',
      fontSize: '12px',
      marginBottom: '4px',
    },
    selectionPreview: {
      color: '#64748b',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    clearButton: {
      background: 'rgba(99, 102, 241, 0.1)',
      border: 'none',
      cursor: 'pointer',
      color: '#6366f1',
      fontSize: '12px',
      fontWeight: '600',
      padding: '6px 12px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    },
    // Messages area
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '20px',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
    },
    // Message bubbles
    messageRow: {
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
    },
    messageRowUser: {
      justifyContent: 'flex-end',
    },
    messageRowAssistant: {
      justifyContent: 'flex-start',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
    },
    avatarAssistant: {
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    },
    messageBubble: {
      maxWidth: '85%',
      padding: '12px 16px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    userBubble: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: 'white',
      borderBottomRightRadius: '6px',
      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
    },
    assistantBubble: {
      background: 'white',
      color: '#1e293b',
      borderBottomLeftRadius: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
    },
    // Loading indicator
    loadingDots: {
      display: 'flex',
      gap: '4px',
      padding: '4px 0',
    },
    loadingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      animation: 'bounce 1.4s infinite ease-in-out',
    },
    // Input area
    inputArea: {
      padding: '16px 20px 20px',
      background: 'white',
      borderTop: '1px solid #f1f5f9',
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      background: '#f8fafc',
      color: '#1e293b',
      resize: 'none',
      fontFamily: 'inherit',
    },
    inputFocused: {
      borderColor: '#6366f1',
      background: 'white',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
    },
    sendButton: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      flexShrink: 0,
    },
    sendButtonActive: {
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    },
    sendButtonDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
    },
  };

  // Dark mode styles
  const darkStyles = {
    container: {
      ...styles.container,
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    messagesArea: {
      ...styles.messagesArea,
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    },
    emptyTitle: {
      ...styles.emptyTitle,
      color: '#f1f5f9',
    },
    emptyText: {
      ...styles.emptyText,
      color: '#94a3b8',
    },
    assistantBubble: {
      ...styles.assistantBubble,
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #334155',
    },
    inputArea: {
      ...styles.inputArea,
      background: '#0f172a',
      borderTop: '1px solid #1e293b',
    },
    input: {
      ...styles.input,
      background: '#1e293b',
      border: '2px solid #334155',
      color: '#f1f5f9',
    },
    inputFocused: {
      ...styles.inputFocused,
      background: '#1e293b',
    },
    selectionBanner: {
      ...styles.selectionBanner,
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    },
    selectionText: {
      ...styles.selectionText,
      color: '#cbd5e1',
    },
    selectionPreview: {
      ...styles.selectionPreview,
      color: '#94a3b8',
    },
  };

  // Check for dark mode
  const [isDark, setIsDark] = useState(false);
  const [fabHovered, setFabHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDarkMode = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const currentStyles = isDark ? { ...styles, ...darkStyles } : styles;

  // CSS keyframes injection
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      .chat-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .chat-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .chat-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      .chat-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Closed state - FAB button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setFabHovered(true)}
        onMouseLeave={() => setFabHovered(false)}
        style={{
          ...styles.fab,
          ...(fabHovered ? styles.fabHover : {}),
        }}
        aria-label="Open chat"
      >
        <span style={{ transform: 'scaleX(-1)' }}>💬</span>
      </button>
    );
  }

  // Open state - Chat panel
  return (
    <div style={currentStyles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>🤖</div>
          <div>
            <div style={styles.headerTitle}>AI Book Assistant</div>
            <div style={styles.headerSubtitle}>
              {selectedText ? 'Selection Mode' : 'Ask anything about the textbook'}
            </div>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button
            onClick={clearChat}
            style={styles.headerButton}
            title="Clear chat"
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            🗑️
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={styles.headerButton}
            title="Close chat"
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Selection mode banner */}
      {selectedText && (
        <div style={currentStyles.selectionBanner}>
          <div style={currentStyles.selectionText}>
            <div style={styles.selectionLabel}>
              <span>📝</span> Selected Text Mode
            </div>
            <div style={currentStyles.selectionPreview}>
              "{selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}"
            </div>
          </div>
          <button
            onClick={onClearSelection}
            style={styles.clearButton}
            onMouseEnter={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.1)'}
          >
            Clear
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={currentStyles.messagesArea} className="chat-scrollbar">
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📚</div>
            <div style={currentStyles.emptyTitle}>
              {selectedText ? 'Ask about the selection' : 'Start a conversation'}
            </div>
            <div style={currentStyles.emptyText}>
              {selectedText
                ? 'I can help explain or answer questions about the text you selected.'
                : 'Ask me anything about Physical AI, robotics, ROS 2, or any topic from the textbook.'}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                ...(msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant),
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{ ...styles.avatar, ...styles.avatarAssistant }}>🤖</div>
              )}
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.role === 'user' ? styles.userBubble : currentStyles.assistantBubble),
                }}
              >
                {msg.content || (msg.role === 'assistant' && isLoading ? (
                  <div style={styles.loadingDots}>
                    <div style={{ ...styles.loadingDot, animationDelay: '0s' }} />
                    <div style={{ ...styles.loadingDot, animationDelay: '0.2s' }} />
                    <div style={{ ...styles.loadingDot, animationDelay: '0.4s' }} />
                  </div>
                ) : '')}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={currentStyles.inputArea}>
        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={selectedText ? 'Ask about the selection...' : 'Ask about the textbook...'}
              disabled={isLoading}
              style={{
                ...currentStyles.input,
                ...(inputFocused ? currentStyles.inputFocused : {}),
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{
              ...styles.sendButton,
              ...(isLoading || !input.trim() ? styles.sendButtonDisabled : styles.sendButtonActive),
            }}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Root({ children }) {
  const [selectedText, setSelectedText] = useState('');
  const [showAskButton, setShowAskButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setButtonPosition({
          top: rect.top + window.scrollY - 48,
          left: rect.left + window.scrollX + rect.width / 2,
        });
        setShowAskButton(true);
        window.__tempSelectedText = text;
      } else {
        setShowAskButton(false);
      }
    };

    const handleMouseDown = (e) => {
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

  // Modern selection button styles
  const askButtonStyles = {
    position: 'absolute',
    top: buttonPosition.top,
    left: buttonPosition.left,
    transform: 'translateX(-50%)',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10000,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    animation: 'slideUp 0.2s ease',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <>
      {children}

      {/* Selection button */}
      {showAskButton && (
        <button
          data-ask-button
          onClick={handleAskAboutSelection}
          style={askButtonStyles}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(-50%) translateY(-2px)';
            e.target.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.5), 0 8px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(-50%)';
            e.target.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <span>💬</span> Ask about selection
        </button>
      )}

      {/* Chat Panel */}
      <ChatPanel selectedText={selectedText} onClearSelection={clearSelection} />
    </>
  );
}
