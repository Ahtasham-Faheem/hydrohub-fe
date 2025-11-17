import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Show loading state while auth is being validated
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/#/login" />;
  }

  if (roles && user?.role && !roles.includes(user.role)) {
    // User's role is not authorized
    return <Navigate to="/#/dashboard" />;
  }

  return <>{children}</>;
};