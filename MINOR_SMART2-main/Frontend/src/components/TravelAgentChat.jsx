import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const SUGGESTION_CHIPS = [
  "Optimize my budget", 
  "Find hidden gems nearby", 
  "Best sunset spots", 
  "Safer routes to take"
];

const TravelAgentChat = ({ context, inline = false }) => {
  const [isOpen, setIsOpen] = useState(inline);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi there! I am your AI Travel Agent. How can I help you customize or optimize your trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen || inline) {
      scrollToBottom();
    }
  }, [messages, isOpen, inline, loading]);

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || input.trim();
    if (!textToSend) return;

    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chat', {
        message: textToSend,
        context: context || 'User is browsing the travel platform.'
      });
      setMessages((prev) => [...prev, { role: 'ai', text: response.data.text }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [...prev, { role: 'ai', text: 'I seem to be having trouble connecting to the network right now. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = inline 
    ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'transparent' }
    : { width: '380px', height: '550px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', borderRadius: '24px' };

  return (
    <div style={inline ? { width: '100%', height: '100%' } : { position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <AnimatePresence>
        {(isOpen || inline) && (
          <motion.div 
            initial={inline ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={inline ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={inline ? "" : "glass-container"} 
            style={containerStyle}
          >
            {!inline && (
              <div style={{ background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>AI Concierge</h3>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', opacity: 0.7 }}>×</button>
              </div>
            )}
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                >
                  <div style={{ 
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.03)', 
                    border: msg.role !== 'user' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    padding: '1rem 1.25rem', 
                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: 'white',
                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(59, 130, 246, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: '6px' }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '0 1.5rem 1rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', borderTop: '1px solid transparent' }}>
              {SUGGESTION_CHIPS.map((chip, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(null, chip)}
                  disabled={loading}
                  style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
                  onMouseOver={e => { if(!loading) e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}}
                  onMouseOut={e => { if(!loading) e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}}
                >
                  {chip}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', padding: '1rem 1.5rem 1.5rem 1.5rem', background: 'transparent' }}>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask about your trip..." 
                disabled={loading}
                style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', marginRight: '0.75rem', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, opacity 0.2s', opacity: loading ? 0.7 : 1 }} onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1.05)'}} onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1)'}}>
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!inline && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)} 
          className="glass-button" 
          style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem', margin: 0, padding: 0, boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)', border: '1px solid rgba(255,255,255,0.2)', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
        >
          {isOpen ? '✕' : '✨'}
        </motion.button>
      )}
    </div>
  );
};

export default TravelAgentChat;
