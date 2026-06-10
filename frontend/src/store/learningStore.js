import { create } from 'zustand';
import { lessonService } from '../services/lesson.service';

const applyProgressToLesson = (lesson, progress) => ({
  ...lesson,
  progress_percent: progress.progress_percent ?? lesson.progress_percent,
  is_completed: progress.is_completed ?? lesson.is_completed,
  content_completed: progress.content_completed ?? lesson.content_completed,
  quiz_score: progress.quiz_score ?? lesson.quiz_score,
  completed_exercise_ids: progress.completed_exercise_ids ?? lesson.completed_exercise_ids,
  exercises: lesson.exercises?.map((ex) => ({
    ...ex,
    is_completed: (progress.completed_exercise_ids ?? lesson.completed_exercise_ids ?? []).includes(ex.id),
  })),
});

const useLearningStore = create((set, get) => ({
  courseId: null,
  courseTitle: '',
  lessons: [],
  currentLesson: null,
  completedLessonIds: [],
  courseProgress: 0,
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
      const courseProgress =
        lessons.length > 0
          ? Math.round(lessons.reduce((sum, l) => sum + (l.progress_percent || 0), 0) / lessons.length)
          : 0;

      set({
        lessons,
        courseTitle: course?.title ?? '',
        completedLessonIds,
        courseProgress,
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

  applyProgressUpdate: (lessonId, progress) => {
    set((state) => {
      const lessons = state.lessons.map((l) =>
        l.id === lessonId ? applyProgressToLesson(l, progress) : l
      );
      const completedLessonIds = lessons.filter((l) => l.is_completed).map((l) => l.id);
      const courseProgress =
        lessons.length > 0
          ? Math.round(lessons.reduce((sum, l) => sum + (l.progress_percent || 0), 0) / lessons.length)
          : 0;

      return {
        lessons,
        completedLessonIds,
        courseProgress,
        currentLesson:
          state.currentLesson?.id === lessonId
            ? applyProgressToLesson(state.currentLesson, progress)
            : state.currentLesson,
        certificate: progress.certificate ?? state.certificate,
        courseCompleted: progress.course_completed || state.courseCompleted,
      };
    });
  },

  markLessonComplete: async (lessonId) => {
    const { completedLessonIds } = get();
    if (completedLessonIds.includes(lessonId)) return null;

    try {
      const data = await lessonService.completeLesson(lessonId);
      const progress = data.progress ?? data;
      get().applyProgressUpdate(lessonId, {
        ...progress,
        certificate: data.certificate,
        course_completed: data.course_completed,
      });
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
