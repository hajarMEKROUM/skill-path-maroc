import api from './api';

export const courseService = {
  // Fetch paginated list of courses with optional filters
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  // Get a specific course by slug or ID
  getCourseDetails: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Enroll in a course
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get user's enrolled courses
  getMyCourses: async () => {
    const response = await api.get('/my-courses');
    return response.data;
  }
};
