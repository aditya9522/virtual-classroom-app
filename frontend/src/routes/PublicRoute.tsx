import { Navigate, Outlet } from 'react-router-dom';
import { useAuthCheck } from '../hooks/useAuthCheck';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PublicRoute = () => {
  const { user, loading } = useAuthCheck();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
