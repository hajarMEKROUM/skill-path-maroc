import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MoreVertical, Paperclip, Smile, Shield } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';
import useAuthStore from '../../store/authStore';
import { freelanceService } from '../../services/freelance.service';

const ChatWindow = ({ conversationId, recipient }) => {
  const messages = useFreelanceStore((state) => state.messages);
  const sendMessage = useFreelanceStore((state) => state.sendMessage);
  const isSendingMessage = useFreelanceStore((state) => state.isSendingMessage);
  const { user } = useAuthStore();

  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const myUserId = user?.id || 'me';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const data = await freelanceService.getMessages(conversationId);
      const raw = data.data ?? data;
      useFreelanceStore.setState({
        messages: Array.isArray(raw) ? raw : [],
      });
    } catch (err) {
      console.error(err);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return undefined;

    useFreelanceStore.setState({ activeConversationId: conversationId });
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId, fetchMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isSendingMessage) return;

    try {
      await sendMessage({
        content: inputText.trim() || (selectedFile ? `Fichier : ${selectedFile.name}` : ''),
        file: selectedFile || undefined,
      });
      setInputText('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // error handled in store
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(file.type) && !['pdf', 'docx'].includes(extension)) {
      alert('Formats acceptes : PDF et DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier ne doit pas depasser 5 Mo.');
      return;
    }

    setSelectedFile(file);
  };

  const apiOrigin = (
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  ).replace(/\/api\/v1\/?$/, '');

  const attachmentUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`;
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex-shrink-0">
      <div className="h-20 bg-slate-900 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {recipient?.name ? recipient.name.charAt(0) : 'E'}
            </div>
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

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {messages.length === 0 ? (
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
                    {msg.attachment_url ? (
                      <a
                        href={attachmentUrl(msg.attachment_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm underline ${isMe ? 'text-emerald-100' : 'text-emerald-600'}`}
                      >
                        📎 {msg.attachment_name || 'Telecharger le fichier'}
                      </a>
                    ) : null}
                    {msg.content && (
                      <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                    )}
                  </div>
                  <div className={`flex mt-1 text-xs text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.isPending && ' • Sending...'}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-3 ${
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

      {selectedFile && (
        <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-sm text-emerald-700">
          <span className="truncate">📎 {selectedFile.name}</span>
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-emerald-600 hover:text-emerald-800 ml-2 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      <div className="h-20 bg-white border-t border-slate-100 px-4 py-4 flex items-center">
        <form onSubmit={handleSend} className="flex w-full items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-shadow">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-emerald-600 p-2 transition-colors"
            title="Joindre un fichier (PDF ou Word)"
          >
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
            disabled={(!inputText.trim() && !selectedFile) || isSendingMessage}
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
