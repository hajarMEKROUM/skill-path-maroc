import { useState, useEffect, useCallback } from 'react';
import { fetchJobs } from '../services/jobService';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobs();
      const list = Array.isArray(res.data) ? res.data : [];
      setJobs(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des offres.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { jobs, loading, error, refetch };
};
