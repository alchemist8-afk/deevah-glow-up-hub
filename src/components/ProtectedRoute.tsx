
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'client':
        return <Navigate to="/" replace />;
      case 'artist':
        return <Navigate to="/artist-dashboard" replace />;
      case 'business':
        return <Navigate to="/business" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
}
