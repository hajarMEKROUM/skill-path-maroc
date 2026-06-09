import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/course.service';

export const useCourses = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getCourses(params);
      setData(res.data || res);
    } catch {
      setError('Erreur de chargement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
