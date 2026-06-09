import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/profileService';

export const useProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUserProfile();
      setData(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du profil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
