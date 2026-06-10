import api from './api';

export const lessonService = {
  getCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data.data ?? response.data;
  },

  getCourseLessons: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  getLessonDetails: async (courseId, lessonId) => {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  getCourseCertificate: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/certificate`);
    return response.data;
  },

  completeLesson: async (lessonId) => {
    const response = await api.patch(`/lessons/${lessonId}/complete`);
    return response.data;
  },

  submitExercise: async (exerciseId, answer) => {
    const response = await api.post(`/exercises/${exerciseId}/submit`, { answer });
    return response.data;
  },

  submitQuizAnswer: async (lessonId, questionIndex, selected) => {
    const response = await api.post(`/lessons/${lessonId}/quiz/answer`, {
      question_index: questionIndex,
      selected,
    });
    return response.data;
  },

  saveVideoProgress: async (lessonId, timeInSeconds) => {
    const response = await api.post('/lesson-progress', {
      lesson_id: lessonId,
      time_watched: timeInSeconds,
    });
    return response.data;
  },

  downloadCertificate: async (certificateId) => {
    const response = await api.post(
      `/certifications/${certificateId}/download`,
      {},
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'text/html',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificat-${certificateId}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
