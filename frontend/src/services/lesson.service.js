import api from './api';

export const lessonService = {
  // Get all lessons for a specific course
  getCourseLessons: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get details of a single lesson (including video url and markdown)
  getLessonDetails: async (courseId, lessonId) => {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Mark a lesson as complete
  completeLesson: async (lessonId) => {
    const response = await api.patch(`/lessons/${lessonId}/complete`);
    return response.data;
  },

  // Save the user's video playback progress (watch time)
  saveVideoProgress: async (lessonId, timeInSeconds) => {
    const response = await api.post(`/progress/update`, {
      lesson_id: lessonId,
      time_watched: timeInSeconds
    });
    return response.data;
  }
};
