
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
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E07A5F]"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.user_role)) {
    // Redirect to appropriate dashboard based on user role
    switch (profile.user_role) {
      case 'client':
        return <Navigate to="/" replace />;
      case 'artist':
        return <Navigate to="/artist-dashboard" replace />;
      case 'business':
        return <Navigate to="/business" replace />;
      case 'transport':
        return <Navigate to="/transport-dashboard" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
}
