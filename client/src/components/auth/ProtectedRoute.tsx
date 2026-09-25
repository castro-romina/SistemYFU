import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser, homeFor, type AccountRole } from "../../lib/auth";

export default function ProtectedRoute({
  role,
  requireOnboarding = true,
}: {
  role?: AccountRole;
  requireOnboarding?: boolean;
}) {
  const location = useLocation();
  const user = getUser();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;

  if (requireOnboarding && !user.onboardingCompleted) {
    const onboardingPath = user.role === "organization" ? "/OnboardingOrg" : "/Onboarding";
    return <Navigate to={onboardingPath} replace state={{ onboardingRequired: true }} />;
  }

  return <Outlet />;
}