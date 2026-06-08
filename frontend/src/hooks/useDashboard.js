import { useCallback, useEffect, useRef, useState } from 'react';
import {
  dashboardService,
  getRecommendedCourses,
  parsePlacementProfile,
} from '../services/dashboard.service';

const initialState = {
  data: null,
  isLoading: true,
  error: null,
};

export const useDashboard = (userId) => {
  const [state, setState] = useState(initialState);
  const fetchedForUserRef = useRef(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await dashboardService.getDashboard();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to load dashboard data. Please try again.';
      setState({ data: null, isLoading: false, error: message });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      fetchedForUserRef.current = null;
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    if (fetchedForUserRef.current === userId) {
      return;
    }

    fetchedForUserRef.current = userId;
    refetch();

    return () => {
      fetchedForUserRef.current = null;
    };
  }, [userId, refetch]);

  return { ...state, refetch };
};

export const useStudentInsights = (userId) => {
  const [recommendations, setRecommendations] = useState(null);
  const [placementProfile, setPlacementProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedForUserRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setRecommendations(null);
      setPlacementProfile(null);
      setIsLoading(false);
      setError(null);
      fetchedForUserRef.current = null;
      return;
    }

    if (fetchedForUserRef.current === userId) {
      return;
    }

    fetchedForUserRef.current = userId;
    let cancelled = false;

    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [coursesRes, resultRes] = await Promise.allSettled([
          dashboardService.getRecommendations(),
          dashboardService.getPlacementResult(),
        ]);

        if (cancelled) return;

        const coursesData = coursesRes.status === 'fulfilled' ? coursesRes.value : null;
        const resultPayload = resultRes.status === 'fulfilled' ? resultRes.value : null;

        setRecommendations(
          getRecommendedCourses(coursesData).length > 0 ? coursesData : null
        );
        setPlacementProfile(parsePlacementProfile(resultPayload));
      } catch (err) {
        if (!cancelled) {
          setRecommendations(null);
          setPlacementProfile(null);
          setError(err.message || 'Unable to load learning insights.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { recommendations, placementProfile, isLoading, error };
};

export const useCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getCertifications();
      setCertifications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load certifications.');
      setCertifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return { certifications, isLoading, error, refetch: fetchCertifications };
};
