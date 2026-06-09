import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/course.service';

export const useMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getMyCourses();
      const raw = res.data ?? res;
      setCourses(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError('Erreur de chargement. Veuillez réessayer.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { courses, loading, error, refetch };
};
