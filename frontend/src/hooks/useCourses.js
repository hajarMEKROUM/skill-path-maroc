import { useState, useEffect, useCallback, useMemo } from 'react';
import { courseService } from '../services/course.service';

export const useCourses = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);
  const memoizedParams = useMemo(() => JSON.parse(paramsKey), [paramsKey]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getCourses(memoizedParams);
      setData(res.data || res);
    } catch {
      setError('Erreur de chargement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [memoizedParams]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await refetch();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [refetch]);

  return { data, loading, error, refetch };
};
