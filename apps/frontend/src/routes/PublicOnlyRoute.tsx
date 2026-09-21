import { Navigate, Outlet } from 'react-router-dom';
import { hasDemoSession } from '../auth/session';

export function PublicOnlyRoute() {
  return hasDemoSession() ? <Navigate to="/" replace /> : <Outlet />;
}
