import { Navigate, Outlet } from "react-router-dom";
import { getUser, homeFor } from "../../lib/auth";

// Login, registro y recuperar contraseña: si ya hay sesión, no se puede volver
export default function GuestRoute() {
  const user = getUser();
  if (user) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}