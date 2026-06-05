import { create } from 'zustand';
import { courseService } from '../services/course.service';

const buildCourseParams = (filters, page) => {
  const params = { page };
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }
  if (filters.level) {
    params.level = filters.level;
  }
  if (filters.category) {
    params.category = filters.category;
  }
  return params;
};

const useCoursesStore = create((set, get) => ({
  courses: [],
  myCourses: [],
  currentCourse: null,
  isLoading: false,
  isEnrolling: false,
  error: null,
  filters: {
    category: '',
    level: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 },
    }));
    get().fetchCourses(1);
  },

  fetchCourses: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = buildCourseParams(filters, page);
      const data = await courseService.getCourses(params);

      const raw = data.data ?? data;
      const courses = Array.isArray(raw) ? raw : [];

      set({
        courses,
        isLoading: false,
        pagination: {
          currentPage: data.meta?.current_page ?? data.current_page ?? page,
          lastPage: data.meta?.last_page ?? data.last_page ?? 1,
          total: data.meta?.total ?? data.total ?? courses.length,
        },
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
        courses: [],
      });
    }
  },

  fetchCourseDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await courseService.getCourseDetails(id);
      const course = data.data ?? data;
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
      await get().fetchMyCourses();
      set({ isEnrolling: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isEnrolling: false,
      });
      throw error;
    }
  },

  fetchMyCourses: async () => {
    try {
      const data = await courseService.getMyCourses();
      const raw = data.data ?? data;
      set({ myCourses: Array.isArray(raw) ? raw : [] });
    } catch (error) {
      console.error('Failed to fetch my courses', error);
    }
  },
}));

export default useCoursesStore;
