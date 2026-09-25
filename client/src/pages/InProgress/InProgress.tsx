import { getUser } from "../../lib/auth";
import VolunteerDashboard from "./VolunteerDashboard";
import OrganizationDashboard from "./OrganizationDashboard";

export default function InProgress() {
  const user = getUser();

  if (user?.role === "organization") return <OrganizationDashboard />;
  return <VolunteerDashboard />;
}