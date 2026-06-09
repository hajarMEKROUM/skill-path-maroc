import React from 'react';
import { Briefcase, Bell } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const MissionsFeed = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center animate-fade-in">
      <GlassCard className="max-w-xl w-full text-center p-12 border-t-4 border-t-primary-500 shadow-xl rounded-2xl bg-white">
        <div className="mx-auto w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Espace Freelance
        </h1>
        <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-6">
          Bientôt disponible
        </div>
        
        <p className="text-gray-500 text-lg mb-8">
          Nous préparons une plateforme de mise en relation exclusive entre nos meilleurs talents et les entreprises partenaires. Restez à l'écoute !
        </p>
        
        <button className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-base shadow-lg shadow-primary-500/30 opacity-75 cursor-not-allowed" disabled>
          <Bell size={20} />
          M'avertir au lancement
        </button>
      </GlassCard>
    </div>
  );
};

export default MissionsFeed;
