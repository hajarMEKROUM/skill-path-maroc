import React, { useEffect, useState } from 'react';
import { Briefcase, Building2, Search, Filter, Clock, Tag, DollarSign, ChevronRight, CheckCircle2 } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';
import ErrorState from '../../components/shared/ErrorState';
import SkeletonCard from '../../components/shared/SkeletonCard';
import api from '../../services/api';
import ProposalModal from '../../components/freelance/ProposalModal';

const JobCard = ({ job, onApply }) => {
  const budgetStr =
    job.budget_min != null && job.budget_max != null
      ? `${job.budget_min} – ${job.budget_max}`
      : job.budget_min != null
        ? `${job.budget_min}+`
        : job.budget;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
          {job.status === 'open' ? 'OPEN' : job.status}
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-purple-700 font-bold text-lg">
            <DollarSign size={18} />
            {budgetStr || '-'}
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5">DH / PROJECT</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">{job.title}</h3>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Building2 size={16} />
        <span>{job.client?.name || job.user?.name || 'Client Anonyme'}</span>
      </div>

      <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-2">
        {job.description}
      </p>

      {/* Tags Mockup since actual tags aren't in model */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">
          <Tag size={12} /> Laravel
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">
          <Tag size={12} /> React
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">
          <Tag size={12} /> API
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
          <Clock size={16} />
          <span>Flexible</span>
        </div>
        <button
          onClick={() => onApply(job.id)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 group"
        >
          Apply Now
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function FreelancePage() {
  const {
    missions,
    isLoadingMissions,
    errorMissions,
    filters,
    setFilters,
    fetchMissions,
    openProposalModal
  } = useFreelanceStore();

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localCategory, setLocalCategory] = useState(filters.category || '');
  const [localMin, setLocalMin] = useState(filters.minBudget || '');
  const [localMax, setLocalMax] = useState(filters.maxBudget || '');
  
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/marketplace');
      setOffers(response.data);
    } catch (err) {
      console.error('Erreur fetchOffers:', err);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchOffers();
  }, [fetchMissions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: localSearch });
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const applyFilters = () => {
    setFilters({ category: localCategory, minBudget: localMin, maxBudget: localMax });
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalCategory('');
    setLocalMin('');
    setLocalMax('');
    setFilters({ search: '', category: '', minBudget: '', maxBudget: '' });
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header section matching screenshot */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <Briefcase size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace</h1>
          <p className="text-gray-500 text-lg mt-2 max-w-2xl leading-relaxed">
            Discover high-paying missions from top Moroccan enterprises. Apply now and start building your reputation.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-[320px] flex-shrink-0 bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg mb-6">
            <Filter size={20} className="text-gray-400" />
            Filter Missions
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="React, Laravel, API..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={localCategory}
                onChange={(e) => {
                  setLocalCategory(e.target.value);
                  setFilters({ category: e.target.value });
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm outline-none appearance-none"
              >
                <option value="">All Categories</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="data">Data Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range (DH)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={applyFilters}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm outline-none text-center"
                />
                <span className="text-gray-400 font-medium">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={applyFilters}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm outline-none text-center"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors text-sm mt-4 border border-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 w-full">
          {errorMissions && <ErrorState message={errorMissions} onRetry={fetchMissions} />}

          {isLoadingMissions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isLoadingMissions && !errorMissions && missions.length === 0 && offers.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Briefcase className="mx-auto h-16 w-16 text-gray-200 mb-4" />
              <p className="text-gray-900 font-bold text-xl mb-2">No missions found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or check back later.</p>
            </div>
          )}

          {!isLoadingMissions && !errorMissions && (missions.length > 0 || offers.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((job) => (
                <JobCard key={`offer-${job.id}`} job={job} onApply={openProposalModal} />
              ))}
              {missions.map((job) => (
                <JobCard key={`mission-${job.id}`} job={job} onApply={openProposalModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProposalModal />
    </div>
  );
}
