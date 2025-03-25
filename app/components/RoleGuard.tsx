import { Navigate, useLocation } from 'react-router';
import { getUserRole, isAuthenticated } from '../api/authService';
import { useState, useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setIsAuth(auth);
        
        if (auth) {
          const role = await getUserRole();
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to auth page
  if (!isAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but no role or wrong role, redirect to root (authenticated page)
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated and has correct role, show the protected content
  return <>{children}</>;
}; 