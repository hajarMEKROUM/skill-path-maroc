import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIRecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Sparkles size={100} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="text-yellow-400" size={20} />
          <span className="text-sm font-semibold tracking-wider uppercase text-primary-100">AI Analysis Complete</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">
          Your Current Level: <span className="text-yellow-400">{recommendation.assessed_level}</span>
        </h3>
        
        <p className="text-primary-100 mb-6 max-w-sm leading-relaxed">
          Based on your recent quiz performances and skill vector, we recommend focusing your learning on <strong className="text-white">{recommendation.recommended_focus}</strong> to accelerate your career.
        </p>
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary-200 uppercase tracking-wide">Suggested Path</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.recommended_technologies?.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium border border-white/20">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link 
            to="/learning-path" 
            className="inline-flex items-center px-5 py-2.5 bg-white text-primary-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm group"
          >
            Start Personalized Path
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AIRecommendationCard;
