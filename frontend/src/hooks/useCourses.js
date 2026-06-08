import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { courseService } from '../services/course.service';

const defaultFilters = {
  search: '',
  level: '',
  category: '',
};

export const useCourseCatalog = (initialFilters = {}) => {
  const [courses, setCourses] = useState([]);
  const [filters, setFiltersState] = useState({ ...defaultFilters, ...initialFilters });
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const filtersRef = useRef(filters);

  filtersRef.current = filters;

  const fetchCourses = useCallback(async (page = 1, activeFilters = filtersRef.current) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const params = { page, per_page: 12 };
      if (activeFilters.search?.trim()) params.search = activeFilters.search.trim();
      if (activeFilters.level) params.level = activeFilters.level;
      if (activeFilters.category) params.category = activeFilters.category;

      const result = await courseService.getCourses(params);

      if (requestId !== requestIdRef.current) return;

      setCourses(result.courses);
      setPagination(result.pagination);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setCourses([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to load courses. Please try again.'
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const setFilters = useCallback(
    (updates, { debounce = false } = {}) => {
      const nextFilters = { ...filtersRef.current, ...updates };
      setFiltersState(nextFilters);
      filtersRef.current = nextFilters;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      if (debounce) {
        debounceRef.current = setTimeout(() => {
          fetchCourses(1, nextFilters);
        }, 350);
        return;
      }

      fetchCourses(1, nextFilters);
    },
    [fetchCourses]
  );

  const refetch = useCallback(() => {
    fetchCourses(pagination.currentPage, filtersRef.current);
  }, [fetchCourses, pagination.currentPage]);

  const goToPage = useCallback(
    (page) => {
      fetchCourses(page, filtersRef.current);
    },
    [fetchCourses]
  );

  useEffect(() => {
    fetchCourses(1, filtersRef.current);
  }, [fetchCourses]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search?.trim() || filters.level || filters.category),
    [filters]
  );

  return {
    courses,
    filters,
    pagination,
    isLoading,
    error,
    hasActiveFilters,
    setFilters,
    refetch,
    goToPage,
  };
};

export const useMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await courseService.getMyCourses();
      setCourses(data);
    } catch (err) {
      setCourses([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to load your courses. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const activeCourses = useMemo(
    () => courses.filter((course) => (course.progress ?? 0) < 100 && !course.completedAt),
    [courses]
  );

  const completedCourses = useMemo(
    () => courses.filter((course) => (course.progress ?? 0) >= 100 || course.completedAt),
    [courses]
  );

  return {
    courses,
    activeCourses,
    completedCourses,
    isLoading,
    error,
    refetch: fetchMyCourses,
  };
};
