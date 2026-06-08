import api from './api';

const unwrap = (payload) => payload?.data ?? payload;

export const formatDuration = (seconds) => {
  const total = Number(seconds);
  if (!total || total <= 0) return null;

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
};

export const normalizeCourse = (course) => {
  if (!course || typeof course !== 'object') return null;

  const instructor = course.instructor ?? {};
  const durationSeconds =
    course.duration_seconds ??
    course.total_duration_seconds ??
    null;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title ?? '',
    description: course.description ?? '',
    price: Number(course.price ?? 0),
    level: course.level ?? null,
    category: course.category ?? course.level ?? null,
    thumbnail: course.thumbnail ?? null,
    status: course.status ?? null,
    instructor,
    instructorName: instructor.name ?? course.instructor_name ?? null,
    lessonsCount: course.lessons_count ?? null,
    durationSeconds: durationSeconds != null ? Number(durationSeconds) : null,
    durationLabel:
      course.duration_label ??
      course.duration ??
      (durationSeconds != null ? formatDuration(durationSeconds) : null),
    progress: course.progress != null ? Number(course.progress) : null,
    enrolledAt: course.enrolled_at ?? null,
    completedAt: course.completed_at ?? null,
    enrollmentId: course.enrollment_id ?? null,
  };
};

export const normalizeCourseList = (payload) => {
  const unwrapped = unwrap(payload);
  const items = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(unwrapped?.data)
      ? unwrapped.data
      : [];

  const meta = payload?.meta ?? unwrapped?.meta ?? {};

  const courses = items.map(normalizeCourse).filter(Boolean);

  return {
    courses,
    pagination: {
      currentPage: Number(meta.current_page ?? 1),
      lastPage: Number(meta.last_page ?? 1),
      total: Number(meta.total ?? courses.length),
    },
  };
};

export const normalizeMyCourses = (payload) => {
  const { courses } = normalizeCourseList(payload);
  return courses;
};

export const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return normalizeCourseList(response.data);
  },

  getCourseDetails: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return normalizeCourse(unwrap(response.data));
  },

  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getMyCourses: async () => {
    const response = await api.get('/my-courses');
    return normalizeMyCourses(response.data);
  },
};
