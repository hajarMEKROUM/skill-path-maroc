import { create } from 'zustand';
import { lessonService } from '../services/lesson.service';

const useLearningStore = create((set, get) => ({
  courseId: null,
  courseTitle: '',
  lessons: [],
  currentLesson: null,
  completedLessonIds: [],
  certificate: null,
  courseCompleted: false,
  isLoading: false,
  error: null,

  initPlayer: async (courseId) => {
    set({
      courseId,
      isLoading: true,
      error: null,
      certificate: null,
      courseCompleted: false,
    });

    try {
      const [lessons, course, certificate] = await Promise.all([
        lessonService.getCourseLessons(courseId),
        lessonService.getCourse(courseId).catch(() => null),
        lessonService.getCourseCertificate(courseId).catch(() => null),
      ]);

      const completedLessonIds = lessons.filter((l) => l.is_completed).map((l) => l.id);

      set({
        lessons,
        courseTitle: course?.title ?? '',
        completedLessonIds,
        certificate,
        courseCompleted: Boolean(certificate) || completedLessonIds.length === lessons.length,
        isLoading: false,
      });

      if (lessons.length > 0) {
        get().selectLesson(lessons[0].id);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectLesson: (lessonId) => {
    const lesson = get().lessons.find((l) => l.id === lessonId);
    if (lesson) {
      set({ currentLesson: lesson, error: null });
    }
  },

  markLessonComplete: async (lessonId) => {
    const { completedLessonIds, lessons } = get();
    if (completedLessonIds.includes(lessonId)) return null;

    try {
      const data = await lessonService.completeLesson(lessonId);
      const updatedCompleted = [...completedLessonIds, lessonId];
      const allDone = updatedCompleted.length === lessons.length;

      set((state) => ({
        completedLessonIds: updatedCompleted,
        lessons: state.lessons.map((l) =>
          l.id === lessonId ? { ...l, is_completed: true } : l
        ),
        currentLesson:
          state.currentLesson?.id === lessonId
            ? { ...state.currentLesson, is_completed: true }
            : state.currentLesson,
        certificate: data.certificate ?? state.certificate,
        courseCompleted: data.course_completed || allDone || state.courseCompleted,
      }));

      return data;
    } catch (error) {
      console.error('Failed to mark lesson complete', error);
      return null;
    }
  },

  getNextLessonId: () => {
    const { lessons, currentLesson } = get();
    if (!currentLesson || !lessons.length) return null;

    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
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
  },
}));

export default useLearningStore;
