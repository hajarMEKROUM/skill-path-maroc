import { useCallback, useEffect, useState, useRef } from 'react';
import { MessageSquare, Search, UserPlus, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useFreelanceStore from '../../store/freelanceStore';
import { freelanceService } from '../../services/freelance.service';
import ChatWindow from '../../components/freelance/ChatWindow';

export default function Messages() {
  const conversations = useFreelanceStore((state) => state.conversations);

  const location = useLocation();

  const [selectedId, setSelectedId] = useState(() => location.state?.conversationId ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await freelanceService.getConversations();
      const raw = data.data ?? data;
      useFreelanceStore.setState({
        conversations: Array.isArray(raw) ? raw : [],
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const activeConversation = conversations.find((c) => c.id === selectedId);
  const toastMessage = location.state?.toast || '';

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { freelanceService } = await import('../../services/freelance.service');
        const data = await freelanceService.searchUsers(q);
        setSearchResults(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const startNewConversation = async (userId) => {
    try {
      const { freelanceService } = await import('../../services/freelance.service');
      const response = await freelanceService.startConversation(userId);
      const newConv = response.data || response;
      await fetchConversations();
      setSelectedId(newConv.id);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-4 h-full">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="text-primary-600" />
        Messages
      </h1>

      {toastMessage && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <Info size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[640px]">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Conversations</h2>

            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Chercher un utilisateur..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto">
            {searchQuery.length >= 2 && (
              <div className="border-b border-gray-100 bg-gray-50 pb-2">
                <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Resultats de recherche</p>
                {isSearching ? (
                  <p className="px-4 text-sm text-gray-500">Recherche...</p>
                ) : searchResults.length === 0 ? (
                  <p className="px-4 text-sm text-gray-500">Aucun utilisateur trouve.</p>
                ) : (
                  searchResults.map((user) => (
                    <button
                      key={`search-${user.id}`}
                      type="button"
                      onClick={() => startNewConversation(user.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                      </div>
                      <UserPlus className="w-4 h-4 text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            )}

            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                Aucune conversation. Contactez un instructeur ou un client depuis une offre.
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedId === conv.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">
                    {conv.other_user?.name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {conv.last_message?.content || 'Aucun message'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex items-stretch">
          {selectedId && activeConversation ? (
            <ChatWindow
              conversationId={selectedId}
              recipient={activeConversation.other_user}
            />
          ) : (
            <div className="flex-1 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Selectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
