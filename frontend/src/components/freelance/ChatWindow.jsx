import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MoreVertical, Paperclip, Smile, Shield } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';
import useAuthStore from '../../store/authStore';

const ChatWindow = ({ conversationId, recipient }) => {
  const { messages, isLoadingChat, setActiveConversation, sendMessage, isSendingMessage } = useFreelanceStore();
  const { user } = useAuthStore(); // needed to know who is 'me'
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSendingMessage) return;
    
    sendMessage({ content: inputText });
    setInputText('');
  };

  // Mocking current user ID if auth store doesn't have it structured yet
  const myUserId = user?.id || 'me';

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex-shrink-0">
      
      {/* Header */}
      <div className="h-20 bg-slate-900 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {recipient?.name ? recipient.name.charAt(0) : 'E'}
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg flex items-center">
              {recipient?.name || 'Enterprise Client'}
              {recipient?.isVerified && <Shield className="w-4 h-4 text-emerald-400 ml-2" />}
            </h2>
            <p className="text-slate-400 text-sm">Online • active now</p>
          </div>
        </div>
        
        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {isLoadingChat ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
              <Send className="w-6 h-6 text-slate-500" />
            </div>
            <p className="font-medium text-slate-600">No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === myUserId;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                  <div 
                    className={`px-5 py-3 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-emerald-600 text-white rounded-tr-sm' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                    } ${msg.isPending ? 'opacity-70' : ''}`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                  </div>
                  <div className={`flex mt-1 text-xs text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.isPending && ' • Sending...'}
                    </span>
                  </div>
                </div>
                
                {/* Optional Avatar next to bubbles */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-3 ${
                    isMe ? 'order-2 bg-emerald-700' : 'order-1 bg-slate-300 text-slate-600'
                  }`}
                >
                  {isMe ? 'ME' : 'C'}
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="h-20 bg-white border-t border-slate-100 px-4 py-4 flex items-center">
        <form onSubmit={handleSend} className="flex w-full items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-shadow">
          <button type="button" className="text-slate-400 hover:text-emerald-600 p-2 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-slate-700 placeholder-slate-400"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSendingMessage}
          />
          
          <button type="button" className="text-slate-400 hover:text-emerald-600 p-2 transition-colors hidden sm:block">
            <Smile className="w-5 h-5" />
          </button>
          
          <button 
            type="submit"
            disabled={!inputText.trim() || isSendingMessage}
            className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatWindow;
