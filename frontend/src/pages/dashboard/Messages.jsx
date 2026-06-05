import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';
import ChatWindow from '../../components/freelance/ChatWindow';

export default function Messages() {
  const {
    conversations,
    activeConversationId,
    fetchConversations,
    setActiveConversation,
    isLoadingChat,
  } = useFreelanceStore();

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedId) {
      setActiveConversation(selectedId);
    }
  }, [selectedId, setActiveConversation]);

  const activeConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="p-6 space-y-4 h-full">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="text-primary-600" />
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[640px]">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
            Conversations
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {isLoadingChat && conversations.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">Chargement…</p>
            ) : conversations.length === 0 ? (
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
              Sélectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
