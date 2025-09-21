import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '../hooks/useAuthCheck';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedLayout from '../layouts/ProtectedLayout';

const ProtectedRoute = () => {
  const { user, loading } = useAuthCheck();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <ProtectedLayout />;
};

export default ProtectedRoute;
