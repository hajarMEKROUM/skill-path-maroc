import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import GlassCard from '../../components/ui/GlassCard';
import { BookOpen, Award, TrendingUp, Sparkles, ClipboardList } from 'lucide-react';
import api from '../../services/api';
import MyCertifications from './MyCertifications';

const getRecommendedCourses = (data) => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

const hasRecommendationData = (recommendations) =>
  recommendations && getRecommendedCourses(recommendations).length > 0;

const hasPlacementProfile = (data) =>
  Boolean(
    data &&
      (data.niveau ||
        data.level ||
        data.parcours_recommande ||
        data.recommended_path ||
        data.score != null)
  );

const parsePlacementResult = (payload) => {
  if (!payload || payload.data === null) {
    return null;
  }
  const profile = payload.data ?? payload;
  if (!profile || typeof profile !== 'object') {
    return null;
  }
  if (
    profile.level == null &&
    profile.niveau == null &&
    profile.score == null &&
    !profile.parcours_recommande &&
    !profile.recommended_path
  ) {
    return null;
  }
  const path = profile.parcours_recommande || profile.recommended_path;
  const langage =
    profile.langage_recommande ||
    profile.recommended_language ||
    (path === 'Mobile' ? 'Flutter' : path === 'Data' ? 'Python' : 'JavaScript');
  return {
    niveau: profile.niveau || profile.level,
    level: profile.level || profile.niveau,
    parcours_recommande: path,
    recommended_path: path,
    langage_recommande: langage,
    recommended_language: langage,
    score: profile.score,
    confidence_score: profile.score,
  };
};

const StudentDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const userName = useAuthStore((state) => state.user?.name);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [placementProfile, setPlacementProfile] = useState(null);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);
  const fetchedForUserRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setAiRecommendations(null);
      setPlacementProfile(null);
      setRecommendationsLoaded(true);
      fetchedForUserRef.current = null;
      return;
    }

    if (fetchedForUserRef.current === userId) {
      return;
    }

    fetchedForUserRef.current = userId;
    let cancelled = false;

    const fetchRecommendations = async () => {
      setRecommendationsLoaded(false);

      try {
        const [coursesRes, resultRes] = await Promise.allSettled([
          api.get('/recommendations'),
          api.get('/placement-test/result'),
        ]);

        if (cancelled) {
          return;
        }

        const coursesData =
          coursesRes.status === 'fulfilled' ? coursesRes.value.data : null;
        const resultPayload =
          resultRes.status === 'fulfilled' ? resultRes.value.data : null;

        if (hasRecommendationData(coursesData)) {
          setAiRecommendations(coursesData);
        } else {
          setAiRecommendations(null);
        }

        setPlacementProfile(parsePlacementResult(resultPayload));
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch recommendations', error);
          setAiRecommendations(null);
          setPlacementProfile(null);
        }
      } finally {
        if (!cancelled) {
          setRecommendationsLoaded(true);
        }
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName || 'Student'}!</h1>
          <p className="text-gray-500 mt-1">Here is your learning progress for today.</p>
        </div>
        <Link
          to="/placement-test"
          className="btn-primary flex items-center justify-center gap-2 py-2 px-4 text-sm"
        >
          <ClipboardList size={18} />
          Test de positionnement
        </Link>
      </div>

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
            <h3 className="text-2xl font-bold text-gray-900">
              {placementProfile?.niveau || placementProfile?.level || '—'}
            </h3>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="text-primary-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">AI Powered Learning Path</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="border-t-4 border-t-primary-500">
            <h3 className="font-semibold text-lg mb-2">Skill Assessment</h3>
            {!recommendationsLoaded ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ) : hasPlacementProfile(placementProfile) ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Niveau :{' '}
                  <span className="font-bold text-primary-600">
                    {placementProfile.niveau || placementProfile.level || '—'}
                  </span>
                  {' · '}
                  Langage :{' '}
                  <span className="font-bold">
                    {placementProfile.langage_recommande ||
                      placementProfile.recommended_language ||
                      '—'}
                  </span>
                </p>
                <p className="text-gray-600">
                  Parcours suggéré :{' '}
                  <span className="font-bold text-primary-600">
                    {placementProfile.parcours_recommande ||
                      placementProfile.recommended_focus ||
                      '—'}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{
                      width: `${placementProfile.confidence_score ?? placementProfile.score ?? 50}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 text-right">
                  Score : {placementProfile.confidence_score ?? placementProfile.score ?? 50}%
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Aucune recommandation pour le moment.{' '}
                <Link to="/placement-test" className="text-primary-600 hover:underline">
                  Passez le test de positionnement
                </Link>{' '}
                pour obtenir un parcours personnalisé.
              </p>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-lg mb-2">Recommended for you</h3>
            {!recommendationsLoaded ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            ) : hasRecommendationData(aiRecommendations) ? (
              <ul className="space-y-3">
                {getRecommendedCourses(aiRecommendations).map((course) => (
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
                          {course.level} · {course.price != null ? `${course.price} MAD` : 'Gratuit'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                Aucun cours recommandé pour le moment.{' '}
                <Link to="/placement-test" className="text-primary-600 hover:underline">
                  Passez le test de positionnement
                </Link>
                .
              </p>
            )}
          </GlassCard>
        </div>
      </div>

      <MyCertifications />
    </div>
  );
};

export default StudentDashboard;
