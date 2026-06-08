import { create } from 'zustand';
import { courseService } from '../services/course.service';

const useCoursesStore = create((set, get) => ({
  currentCourse: null,
  isLoading: false,
  isEnrolling: false,
  error: null,

  fetchCourseDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourseDetails(id);
      set({ currentCourse: course, isLoading: false });
      return course;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
        currentCourse: null,
      });
      throw error;
    }
  },

  enrollInCourse: async (id) => {
    set({ isEnrolling: true, error: null });
    try {
      await courseService.enroll(id);
      set({ isEnrolling: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isEnrolling: false,
      });
      throw error;
    }
  },
}));

export default useCoursesStore;
