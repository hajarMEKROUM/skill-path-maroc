import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Building, Tags, ArrowRight } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';

const MissionCard = ({ mission }) => {
  const { openProposalModal } = useFreelanceStore();

  const {
    id,
    title = 'Untitled Mission',
    client = { name: 'Anonymous Enterprise' },
    budget_min = 0,
    budget_max = 0,
    deadline,
    description = '',
    skills = ['Laravel', 'React', 'Tailwind'],
    status = 'open'
  } = mission;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-glass-hover flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wide mb-3">
            {status}
          </span>
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Building className="w-4 h-4 mr-1.5" />
            {client.name}
          </div>
        </div>
        <div className="flex flex-col items-end text-right ml-4">
          <div className="flex items-center text-lg font-bold text-primary-600">
            <DollarSign className="w-5 h-5 mr-0.5" />
            {budget_min} - {budget_max}
          </div>
          <span className="text-xs text-gray-500 uppercase font-semibold mt-1">DH / Project</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
        {description}
      </p>

      {/* Footer Info */}
      <div className="border-t border-gray-100 pt-5 mt-auto">
        <div className="flex flex-wrap gap-2 mb-5">
          {skills.map((skill, idx) => (
            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              <Tags className="w-3 h-3 mr-1.5 text-gray-400" />
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Clock className="w-4 h-4 mr-1.5 text-amber-500" />
            {deadline ? new Date(deadline).toLocaleDateString() : 'Flexible'}
          </div>
          
          <button 
            onClick={() => openProposalModal(id)}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm group"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;
