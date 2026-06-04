import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import useFreelanceStore from '../../store/freelanceStore';

const FreelanceSidebar = () => {
  const { filters, setFilters } = useFreelanceStore();

  const handleSearchChange = (e) => setFilters({ search: e.target.value });
  const handleCategoryChange = (e) => setFilters({ category: e.target.value });
  
  // Handlers for budget ranges can be more complex, keeping it simple for UI demo
  const handleMinBudgetChange = (e) => setFilters({ minBudget: e.target.value });
  const handleMaxBudgetChange = (e) => setFilters({ maxBudget: e.target.value });

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      <GlassCard className="p-5">
        <div className="flex items-center space-x-2 mb-6">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900">Filter Missions</h2>
        </div>

        {/* Search */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-semibold text-gray-700">Keywords</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="React, Laravel, API..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm outline-none"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm outline-none appearance-none cursor-pointer"
              value={filters.category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="web-dev">Web Development</option>
              <option value="mobile-dev">Mobile Apps</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="backend">Backend & APIs</option>
              <option value="data">Data Science & AI</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Budget Range (DH)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm outline-none"
              value={filters.minBudget}
              onChange={handleMinBudgetChange}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm outline-none"
              value={filters.maxBudget}
              onChange={handleMaxBudgetChange}
            />
          </div>
        </div>

        {/* Reset Filters (Optional but good UX) */}
        <button 
          className="w-full mt-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          onClick={() => setFilters({ search: '', category: '', minBudget: '', maxBudget: '' })}
        >
          Clear Filters
        </button>
      </GlassCard>
    </div>
  );
};

export default FreelanceSidebar;
