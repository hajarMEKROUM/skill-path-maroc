import api from './api';

const unwrap = (payload) => payload?.data ?? payload;

export const normalizeDashboard = (payload) => {
  const data = unwrap(payload) ?? {};

  return {
    role: data.role ?? 'student',
    totalCoursesEnrolled: Number(data.total_courses_enrolled ?? 0),
    totalCertificates: Number(data.total_certificates ?? 0),
    activeCourses: Number(data.active_courses ?? 0),
    overallProgress: Number(data.overall_progress ?? 0),
    learningProgress: Array.isArray(data.learning_progress) ? data.learning_progress : [],
    stats: data.stats ?? {},
    courses: Array.isArray(data.courses) ? data.courses : [],
    recentProposals: Array.isArray(data.recent_proposals) ? data.recent_proposals : [],
    recentJobs: Array.isArray(data.recent_jobs) ? data.recent_jobs : [],
    recentActivity: Array.isArray(data.recent_activity) ? data.recent_activity : [],
  };
};

export const getRecommendedCourses = (data) => {
  const unwrapped = unwrap(data);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.data)) return unwrapped.data;
  return [];
};

export const parsePlacementProfile = (payload) => {
  const profile = unwrap(payload);
  if (!profile || profile === null || typeof profile !== 'object') {
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

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return normalizeDashboard(response.data);
  },

  getRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  getPlacementResult: async () => {
    const response = await api.get('/placement-test/result');
    return response.data;
  },

  getCertifications: async () => {
    const response = await api.get('/certifications');
    const data = unwrap(response.data);
    return Array.isArray(data) ? data : [];
  },

  downloadCertification: async (id) => {
    return api.post(`/certifications/${id}/download`, {}, { responseType: 'blob' });
  },
};
