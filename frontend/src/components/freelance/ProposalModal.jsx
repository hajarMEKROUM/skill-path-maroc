import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';

const ProposalModal = () => {
  const { proposalModalOpen, closeProposalModal, submitProposal, isSubmittingProposal } = useFreelanceStore();
  
  const [formData, setFormData] = useState({
    bid_amount: '',
    delivery_days: '',
    cover_letter: ''
  });
  
  const [error, setError] = useState('');

  if (!proposalModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.bid_amount || !formData.delivery_days || !formData.cover_letter) {
      setError('Please fill out all fields.');
      return;
    }
    
    try {
      await submitProposal(formData);
      // Reset form on success
      setFormData({ bid_amount: '', delivery_days: '', cover_letter: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmittingProposal) {
      closeProposalModal();
    }
  };

  const charCount = formData.cover_letter.length;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={handleOverlayClick}
      >
        {/* Dark Glassmorphism Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-gray-50/80">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submit Proposal</h2>
              <p className="text-sm text-gray-500 mt-1">Provide your bid details and a compelling cover letter.</p>
            </div>
            <button 
              onClick={closeProposalModal}
              disabled={isSubmittingProposal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start border border-red-100">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bid Amount (DH)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium">DH</span>
                  <input
                    type="number"
                    min="0"
                    disabled={isSubmittingProposal}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                    placeholder="e.g. 5000"
                    value={formData.bid_amount}
                    onChange={(e) => setFormData({...formData, bid_amount: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Time (Days)</label>
                <input
                  type="number"
                  min="1"
                  disabled={isSubmittingProposal}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                  placeholder="e.g. 14"
                  value={formData.delivery_days}
                  onChange={(e) => setFormData({...formData, delivery_days: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-semibold text-gray-700">Cover Letter</label>
                <span className={`text-xs ${charCount > 1000 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                  {charCount} / 1000
                </span>
              </div>
              <textarea
                rows="6"
                disabled={isSubmittingProposal}
                className="block w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none resize-none"
                placeholder="Describe your approach, relevant experience, and why you are the best fit for this mission..."
                value={formData.cover_letter}
                onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
              ></textarea>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end space-x-3 bg-gray-50/80">
            <button
              type="button"
              onClick={closeProposalModal}
              disabled={isSubmittingProposal}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmittingProposal || charCount > 1000}
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center shadow-sm disabled:opacity-50"
            >
              {isSubmittingProposal ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmittingProposal ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProposalModal;
