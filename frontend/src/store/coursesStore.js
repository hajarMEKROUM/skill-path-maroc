import { create } from 'zustand';
import { courseService } from '../services/course.service';

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
      pagination: { ...state.pagination, currentPage: 1 } // Reset page on filter
    }));
    get().fetchCourses();
  },

  fetchCourses: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const data = await courseService.getCourses({ ...filters, page });
      
      // Assume Laravel pagination structure: data.data is array, data.meta has pagination info
      // Fallback if not paginated properly in backend yet
      const courses = data.data || data; 
      
      set({ 
        courses: courses, 
        isLoading: false,
        pagination: {
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || courses.length,
        }
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCourseDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await courseService.getCourseDetails(id);
      set({ currentCourse: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  enrollInCourse: async (id) => {
    set({ isEnrolling: true, error: null });
    try {
      await courseService.enroll(id);
      // Refresh my courses after enrollment
      await get().fetchMyCourses();
      set({ isEnrolling: false });
    } catch (error) {
      set({ error: error.message, isEnrolling: false });
    }
  },

  fetchMyCourses: async () => {
    try {
      const data = await courseService.getMyCourses();
      set({ myCourses: data.data || data });
    } catch (error) {
      console.error("Failed to fetch my courses", error);
    }
  }
}));

export default useCoursesStore;
