import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Messages() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="text-primary-600" />
        Messages
      </h1>
      <p className="text-gray-500">
        Aucun message pour le moment. Vos conversations avec les instructeurs et le support apparaîtront ici.
      </p>
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400 text-sm">
        Boîte de réception vide
      </div>
    </div>
  );
}
