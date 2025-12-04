import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function VoiceAgent() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { role: 'model', parts: [{ text: "Hello! I'm your Restaurant Voice Agent. How can I help you today?" }] }
    ];
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Ready');
  const recognitionRef = useRef(null);
  const messagesRef = useRef([]); // Ref to hold latest messages
  const messagesEndRef = useRef(null); // Ref for scrolling

  // Update ref and localStorage whenever messages change
  useEffect(() => {
    messagesRef.current = messages;
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat history
  const clearHistory = () => {
    const initialMsg = [{ role: 'model', parts: [{ text: "Hello! I'm your Restaurant Voice Agent. How can I help you today?" }] }];
    setMessages(initialMsg);
    localStorage.setItem('chatHistory', JSON.stringify(initialMsg));
    window.location.reload(); // Reload to reset state cleanly
  };
  
  // Initialize Speech Recognition on mount
  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatus('Listening...');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setStatus('Processing...');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
        setStatus('Error: ' + event.error);
      };
    } else {
      setStatus('Speech Recognition not supported in this browser.');
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any current speech
      window.speechSynthesis.cancel();

      // Clean text: remove asterisks, hash signs, and other markdown symbols
      const cleanText = text.replace(/[*#_`]/g, '').replace(/\n/g, '. ');
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-restart listening for natural flow
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log("Mic already active or blocked");
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak greeting on load only if it's a fresh start
  // For now, i keep it simple: always speak if it's the first message or just loaded
  useEffect(() => {
    // Only speak greeting if history is empty or just has the greeting
    if (messages.length <= 1) {
      const greeting = "Hello! I'm your Restaurant Voice Agent. How can I help you today?";
      speak(greeting);
    }
  }, []);


  // Handle user message and send to backend API
  const handleUserMessage = async (text) => {
    // Use ref to get the latest history
    const currentHistory = messagesRef.current;
    
    // Add user message to UI
    const newHistory = [...currentHistory, { role: 'user', parts: [{ text }] }];
    setMessages(newHistory);

    try {
      // Prepare history for Backend (Gemini requires history to start with 'user')
      // We filter out the initial greeting if it's the first message and is from 'model'
      const historyToSend = currentHistory.filter((msg, index) => {
        if (index === 0 && msg.role === 'model') return false;
        return true;
      }).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: m.parts
      }));

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        message: text,
        history: historyToSend
      });

      const botText = response.data.response;
      
      // Add bot response to UI
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: botText }] }]);
      setStatus('Ready');
      
      // Speak response
      speak(botText);

    } catch (error) {
      console.error("API Error:", error);
      setStatus('Error connecting to server.');
    }
  };


  // Toggle listening state  
  // If already speaking, stop speech and start listening
  const toggleListening = () => {
    if (isSpeaking) {
      // If speaking, stop speech and start listening
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start mic", e);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Restaurant Background" 
          className="w-full h-full object-cover opacity-20 blur-sm"
        />
      </div>

      <div className="w-full max-w-md bg-stone-800/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-stone-700">
        {/* Header */}
        <div className="bg-amber-700 p-6 text-center relative">
          <h1 className="text-2xl font-serif font-bold text-amber-50">Table Concierge</h1>
          <p className="text-amber-200 text-sm mt-1">Book your perfect dining experience</p>
          <button 
            onClick={clearHistory}
            className="absolute top-4 right-4 text-xs bg-amber-900/50 hover:bg-amber-900 text-amber-100 px-3 py-1 rounded-full transition-colors border border-amber-600/30"
          >
            Clear Chat
          </button>
          <Link to="/" className="absolute top-4 left-4 text-amber-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* Chat Area */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="text-stone-400 text-center mt-20 flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p>Tap the microphone to start your reservation.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-amber-600 text-white rounded-br-none' 
                  : 'bg-stone-700 text-stone-100 rounded-bl-none border border-stone-600'
              }`}>
                <p className="leading-relaxed">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-6 bg-stone-900/50 border-t border-stone-700 flex flex-col items-center backdrop-blur-sm">
          <div className="mb-4 text-xs font-mono text-amber-500 uppercase tracking-wider">
            {status}
          </div>
          
          <button 
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
              isListening 
                ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                : 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.4)]'
            } ${isSpeaking ? 'ring-4 ring-amber-300 ring-offset-2 ring-offset-stone-900' : ''}`}
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceAgent;
