import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser, homeFor, type AccountRole } from "../../lib/auth";

// Solo entra quien tiene sesión (y, si se indica, el rol correcto)
export default function ProtectedRoute({ role }: { role?: AccountRole }) {
  const location = useLocation();
  const user = getUser();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}