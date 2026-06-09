import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { BookOpen, Award, Activity, ClipboardList } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import MyCertifications from './MyCertifications';
import ErrorState from '../../components/shared/ErrorState';
import RecommendationsCard from '../../components/RecommendationsCard';
import api from '../../services/api';

const StudentDashboard = () => {
  const userName = useAuthStore((state) => state.user?.name);
  const { data, loading, error, refetch } = useDashboard();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await api.get('/placement-test/result');
        setRecommendation(response.data?.data ?? response.data ?? null);
      } catch {
        setRecommendation(null);
      }
    };

    fetchRecommendation();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Bienvenue, {userName || 'Étudiant'} !</h1>
          <p className="text-gray-500 mt-1">Voici votre progression d&apos;apprentissage pour aujourd&apos;hui.</p>
        </div>
        <Link
          to="/placement-test"
          className="btn-primary flex items-center justify-center gap-2 py-2 px-4 text-sm"
        >
          <ClipboardList size={18} />
          Test de Positionnement
        </Link>
      </div>

      {error && (
        <ErrorState message="Une erreur est survenue lors du chargement de vos données." onRetry={refetch} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="page-card flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Formations inscrites</p>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{data?.total_courses_enrolled ?? 0}</h3>
            )}
          </div>
        </div>

        <div className="page-card flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Certificats</p>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{data?.total_certificates ?? 0}</h3>
            )}
          </div>
        </div>

        <div className="page-card flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Formations actives</p>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{data?.active_courses ?? 0}</h3>
            )}
          </div>
        </div>
      </div>

      {!loading && !error && data?.total_courses_enrolled === 0 && (
        <div className="page-card bg-purple-50 border-purple-100 flex flex-col items-center justify-center py-10 text-center">
          <p className="text-lg text-purple-800 font-medium mb-4">
            Vous n&apos;êtes inscrit à aucune formation pour le moment.
          </p>
          <Link to="/courses" className="btn-primary py-2 px-6">
            Parcourir le catalogue
          </Link>
        </div>
      )}

      {!loading && !error && data?.total_certificates === 0 && (
        <div className="page-card text-center py-8">
          <Award className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-700 font-medium">
            Complétez une formation pour obtenir votre premier certificat.
          </p>
        </div>
      )}

      {recommendation ? (
        <RecommendationsCard recommendation={recommendation} />
      ) : (
        <div className="page-card bg-gray-50 opacity-70">
          <p className="text-gray-500 text-center font-medium">Parcours IA — Bientôt disponible</p>
        </div>
      )}

      {!loading && !error && (data?.total_certificates ?? 0) > 0 && <MyCertifications />}
    </div>
  );
};

export default StudentDashboard;
