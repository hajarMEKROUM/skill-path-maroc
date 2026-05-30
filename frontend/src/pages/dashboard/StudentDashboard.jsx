import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import GlassCard from '../../components/ui/GlassCard';
import { BookOpen, Award, TrendingUp, Sparkles } from 'lucide-react';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [aiRecommendations, setAiRecommendations] = useState(null);

  useEffect(() => {
    // Fetch AI recommendations from Laravel API (which proxies to FastAPI)
    // Or call FastAPI directly if configured. Assuming direct proxy for now.
    const fetchRecommendations = async () => {
      try {
        const response = await api.get(`/recommendations/${user.id}`);
        setAiRecommendations(response.data);
      } catch (error) {
        console.error("Failed to fetch AI recommendations", error);
      }
    };
    if (user?.id) fetchRecommendations();
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">Here is your learning progress for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hover className="flex items-center space-x-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Enrolled Courses</p>
            <h3 className="text-2xl font-bold text-gray-900">4</h3>
          </div>
        </GlassCard>

        <GlassCard hover className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Certificates</p>
            <h3 className="text-2xl font-bold text-gray-900">2</h3>
          </div>
        </GlassCard>

        <GlassCard hover className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Current Level</p>
            <h3 className="text-2xl font-bold text-gray-900">Intermediate</h3>
          </div>
        </GlassCard>
      </div>

      {/* AI Recommendations Section */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="text-primary-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">AI Powered Learning Path</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="border-t-4 border-t-primary-500">
            <h3 className="font-semibold text-lg mb-2">Skill Assessment</h3>
            {aiRecommendations ? (
              <div className="space-y-4">
                <p className="text-gray-600">Based on your recent quiz scores, our AI recommends focusing on <span className="font-bold text-primary-600">{aiRecommendations.recommended_focus}</span>.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${aiRecommendations.confidence_score}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 text-right">Confidence: {aiRecommendations.confidence_score}%</p>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            )}
          </GlassCard>

          <GlassCard>
             <h3 className="font-semibold text-lg mb-2">Recommended for you</h3>
             <ul className="space-y-3">
                {/* Mocked recommended courses */}
                <li className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Advanced Laravel 12 API</h4>
                    <p className="text-sm text-gray-500">Match: 95%</p>
                  </div>
                </li>
             </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
