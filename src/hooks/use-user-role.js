import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  return { userRole, loading };
};

export default useUserRole;
