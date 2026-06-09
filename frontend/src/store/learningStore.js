import { create } from 'zustand';
import { lessonService } from '../services/lesson.service';

const useLearningStore = create((set, get) => ({
  courseId: null,
  lessons: [],
  currentLesson: null,
  completedLessonIds: [],
  isLoading: false,
  error: null,

  // Initialize the learning player
  initPlayer: async (courseId) => {
    set({ courseId, isLoading: true, error: null });
    try {
      const data = await lessonService.getCourseLessons(courseId);
      const lessons = Array.isArray(data?.lessons)
        ? data.lessons
        : Array.isArray(data)
          ? data
          : [];

      set({ 
        lessons, 
        completedLessonIds: data.completed_ids || [],
        isLoading: false 
      });

      if (lessons.length > 0) {
        get().selectLesson(lessons[0].id);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectLesson: async (lessonId) => {
    const { courseId } = get();
    set({ isLoading: true });
    try {
      const lessonData = await lessonService.getLessonDetails(courseId, lessonId);
      set({ currentLesson: lessonData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  markLessonComplete: async (lessonId) => {
    const { completedLessonIds } = get();
    if (completedLessonIds.includes(lessonId)) return; // Already complete

    try {
      await lessonService.completeLesson(lessonId);
      set((state) => ({
        completedLessonIds: [...state.completedLessonIds, lessonId]
      }));
    } catch (error) {
      console.error('Failed to mark lesson complete', error);
    }
  },

  getNextLessonId: () => {
    const { lessons, currentLesson } = get();
    if (!currentLesson || !lessons.length) return null;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1].id;
    }
    return null;
  },

  getPreviousLessonId: () => {
    const { lessons, currentLesson } = get();
    if (!currentLesson || !lessons.length) return null;

    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex > 0) {
      return lessons[currentIndex - 1].id;
    }
    return null;
  }
}));

export default useLearningStore;
