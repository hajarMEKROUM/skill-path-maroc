import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, SearchX } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';
import FreelanceSidebar from '../../components/freelance/FreelanceSidebar';
import MissionCard from '../../components/freelance/MissionCard';
import ProposalModal from '../../components/freelance/ProposalModal';

const MissionsFeed = () => {
  const { missions, isLoadingMissions, fetchMissions } = useFreelanceStore();

  useEffect(() => {
    fetchMissions();
    // Assuming backend returns some initial data
  }, [fetchMissions]);

  // Framer Motion variants for grid stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in bg-slate-50 min-h-screen">
      
      {/* Premium Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          Marketplace
        </h1>
        <p className="text-lg text-slate-500 mt-2 ml-16 max-w-2xl">
          Discover high-paying missions from top Moroccan enterprises. Apply now and start building your reputation.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <FreelanceSidebar />

        {/* Main Feed */}
        <div className="flex-1">
          {isLoadingMissions ? (
            // Skeleton Loaders
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse h-64">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2 w-2/3">
                      <div className="h-4 bg-slate-200 rounded-full w-16"></div>
                      <div className="h-6 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : missions.length === 0 ? (
            // Elegant Empty State
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No missions found</h3>
              <p className="text-slate-500 max-w-md">
                We couldn't find any missions matching your current filters. Try adjusting your search criteria or categories.
              </p>
            </div>
          ) : (
            // Animated Mission Grid
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
            >
              {missions.map((mission) => (
                <motion.div key={mission.id} variants={itemVariants} className="h-full">
                  <MissionCard mission={mission} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Global Modals */}
      <ProposalModal />

    </div>
  );
};

export default MissionsFeed;
