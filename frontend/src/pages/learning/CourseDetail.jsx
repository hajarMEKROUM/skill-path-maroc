import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader2, User } from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import useCoursesStore from '../../store/coursesStore';

const levelLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { enrollInCourse, isEnrolling } = useCoursesStore();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollMessage, setEnrollMessage] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/courses/${id}`);
        const data = response.data.data ?? response.data;
        setCourse(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Cours introuvable.');
        } else {
          setError(err.response?.data?.message || 'Impossible de charger ce cours.');
        }
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrollMessage(null);
    try {
      await enrollInCourse(id);
      setEnrollMessage('Inscription confirmée !');
    } catch (err) {
      setEnrollMessage(
        err.response?.data?.message || "Erreur lors de l'inscription."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <BookOpen className="mx-auto text-gray-300 mb-4" size={56} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cours introuvable</h1>
        <p className="text-gray-500 mb-6">{error || "Ce cours n'existe pas ou n'est plus disponible."}</p>
        <Link to="/courses" className="text-primary-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const instructorName =
    course.instructor?.name ?? course.instructor?.data?.name ?? 'Instructeur';
  const price = parseFloat(course.price) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-primary-600 hover:underline mb-8"
      >
        <ArrowLeft size={18} />
        Retour au catalogue
      </Link>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="h-48 sm:h-64 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-white opacity-90">
              {course.title?.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 capitalize">
              {levelLabels[course.level] || course.level}
            </span>
            <span className="text-2xl font-extrabold text-primary-600">
              {price > 0 ? `${price} MAD` : 'Gratuit'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

          <p className="flex items-center gap-2 text-gray-500 mb-6">
            <User size={18} />
            Par {instructorName}
          </p>

          <div className="prose prose-gray max-w-none mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {course.description || 'Aucune description disponible.'}
            </p>
          </div>

          {enrollMessage && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                enrollMessage.includes('confirmée')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {enrollMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="btn-primary py-3 px-8 text-base disabled:opacity-50"
          >
            {isEnrolling ? 'Inscription...' : "S'inscrire au cours"}
          </button>

          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-3">
              Vous devez être connecté pour vous inscrire.{' '}
              <Link to="/login" className="text-primary-600 hover:underline">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
