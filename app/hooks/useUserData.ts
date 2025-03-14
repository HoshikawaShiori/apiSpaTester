import { useState, useEffect } from 'react';
import api from '../api/config';

const useUserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get('api/v1/user');
      setUserData(response.data);
      setError(null);
    } catch (err: any) {
      setUserData(null);
      if (err.response?.status !== 401) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, error, refetch: fetchUserData };
};

export default useUserData; 