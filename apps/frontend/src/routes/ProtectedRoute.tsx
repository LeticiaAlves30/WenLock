import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { hasDemoSession } from '../auth/session';

export function ProtectedRoute() {
  const location = useLocation();

  if (!hasDemoSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
