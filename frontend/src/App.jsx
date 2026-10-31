import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ResearchModal from './components/ResearchModal';
import FeedbackHistoryModal from './components/FeedbackHistoryModal';
import { Send, RefreshCw, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function App() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      isWelcome: true
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/benchmarks`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApiOnline(true);
        }
      })
      .catch(() => {
        setApiOnline(false);
      });
  }, []);

  const handleSendMessage = async (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      text: trimmed,
      time: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, show_vanilla: true })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg = {
          id: Date.now() + '-bot',
          sender: 'bot',
          result: data,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setApiOnline(true);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setApiOnline(false);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now() + '-welcome',
        sender: 'bot',
        isWelcome: true
      }
    ]);
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      
      <Header 
        onOpenResearch={() => setIsResearchModalOpen(true)}
        onOpenFeedbackHistory={() => setIsFeedbackModalOpen(true)}
        onNewChat={handleNewChat}
        apiOnline={apiOnline}
      />

      <main className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 flex-1 flex flex-col justify-between">
        
        <div className="flex-1 pb-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectSample={(sampleText) => {
                setInputText(sampleText);
                handleSendMessage(sampleText);
              }}
              apiBaseUrl={API_BASE_URL}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 my-3 text-xs text-slate-500 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>RAMP26 ৪টি বিভাগের প্রেক্ষাপটে মূল্যায়ন করছে...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </main>

      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 shadow-lg">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white border border-slate-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 rounded-2xl px-3 sm:px-4 py-2 transition shadow-xs"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="যেকোনো বাংলা মন্তব্য বা বাক্য লিখুন এবং Enter চাপুন..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0 cursor-pointer"
              title="পাঠান"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            RAMP26 আন্ডারগ্র্যাজুয়েট থিসিস প্রজেক্ট • Dept. of CSE, City University, Dhaka
          </p>
        </div>
      </div>

      <ResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      <FeedbackHistoryModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        apiBaseUrl={API_BASE_URL}
      />

    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ResearchModal from './components/ResearchModal';
import FeedbackHistoryModal from './components/FeedbackHistoryModal';
import { Send, RefreshCw, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function App() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      isWelcome: true
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/benchmarks`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApiOnline(true);
        }
      })
      .catch(() => {
        setApiOnline(false);
      });
  }, []);

  const handleSendMessage = async (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      text: trimmed,
      time: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, show_vanilla: true })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg = {
          id: Date.now() + '-bot',
          sender: 'bot',
          result: data,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setApiOnline(true);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setApiOnline(false);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now() + '-welcome',
        sender: 'bot',
        isWelcome: true
      }
    ]);
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      
      <Header 
        onOpenResearch={() => setIsResearchModalOpen(true)}
        onOpenFeedbackHistory={() => setIsFeedbackModalOpen(true)}
        onNewChat={handleNewChat}
        apiOnline={apiOnline}
      />

      <main className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 flex-1 flex flex-col justify-between">
        
        <div className="flex-1 pb-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectSample={(sampleText) => {
                setInputText(sampleText);
                handleSendMessage(sampleText);
              }}
              apiBaseUrl={API_BASE_URL}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 my-3 text-xs text-slate-500 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>RAMP26 ৪টি বিভাগের প্রেক্ষাপটে মূল্যায়ন করছে...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </main>

      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 shadow-lg">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white border border-slate-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 rounded-2xl px-3 sm:px-4 py-2 transition shadow-xs"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="যেকোনো বাংলা মন্তব্য বা বাক্য লিখুন এবং Enter চাপুন..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0 cursor-pointer"
              title="পাঠান"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            RAMP26 আন্ডারগ্র্যাজুয়েট থিসিস প্রজেক্ট • Dept. of CSE, City University, Dhaka
          </p>
        </div>
      </div>

      <ResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      <FeedbackHistoryModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        apiBaseUrl={API_BASE_URL}
      />

    </div>
  );
}

