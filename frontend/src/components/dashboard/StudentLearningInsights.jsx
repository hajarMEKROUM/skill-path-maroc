import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { getRecommendedCourses } from '../../services/dashboard.service';

const hasPlacementProfile = (profile) =>
  Boolean(
    profile &&
      (profile.niveau ||
        profile.level ||
        profile.parcours_recommande ||
        profile.recommended_path ||
        profile.score != null)
  );

const StudentLearningInsights = ({
  placementProfile,
  recommendations,
  isLoading,
}) => {
  const recommendedCourses = getRecommendedCourses(recommendations);

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-primary-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">AI Powered Learning Path</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="border-t-4 border-t-primary-500">
          <h3 className="font-semibold text-lg mb-2">Skill Assessment</h3>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-2.5 bg-gray-200 rounded w-full" />
            </div>
          ) : hasPlacementProfile(placementProfile) ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Level:{' '}
                <span className="font-bold text-primary-600">
                  {placementProfile.niveau || placementProfile.level || '—'}
                </span>
                {' · '}
                Language:{' '}
                <span className="font-bold">
                  {placementProfile.langage_recommande ||
                    placementProfile.recommended_language ||
                    '—'}
                </span>
              </p>
              <p className="text-gray-600">
                Suggested path:{' '}
                <span className="font-bold text-primary-600">
                  {placementProfile.parcours_recommande ||
                    placementProfile.recommended_focus ||
                    '—'}
                </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${placementProfile.confidence_score ?? placementProfile.score ?? 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 text-right">
                Score: {placementProfile.confidence_score ?? placementProfile.score ?? 0}%
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No assessment yet.{' '}
              <Link to="/placement-test" className="text-primary-600 hover:underline">
                Take the placement test
              </Link>{' '}
              to get a personalized learning path.
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-lg mb-2">Recommended for you</h3>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          ) : recommendedCourses.length > 0 ? (
            <ul className="space-y-3">
              {recommendedCourses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug || course.id}`}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-md mr-4 flex items-center justify-center font-bold text-sm">
                      {course.level?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {course.level} · {course.price != null ? `${course.price} MAD` : 'Free'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No recommended courses yet.{' '}
              <Link to="/placement-test" className="text-primary-600 hover:underline">
                Take the placement test
              </Link>{' '}
              or{' '}
              <Link to="/courses" className="text-primary-600 hover:underline">
                browse courses
              </Link>
              .
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default StudentLearningInsights;
