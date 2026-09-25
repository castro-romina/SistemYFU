import { type ReactNode } from "react";
import {
  LayoutGrid,
  Search,
  ClipboardCheck,
  MessageSquare,
  User,
  PlusCircle,
  Users,
  Building2,
} from "lucide-react";
import Sidebar, { type NavItem } from "./Sidebar";
import { getUser } from "../../lib/auth";

const volunteerNavItems: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutGrid },
  { label: "Find opportunities", to: "/opportunities", icon: Search },
  { label: "My applications", to: "/applications", icon: ClipboardCheck },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "My profile", to: "/profile", icon: User },
];

const organizationNavItems: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutGrid },
  { label: "Post opportunity", to: "/tasks/new", icon: PlusCircle },
  { label: "Applicants", to: "/applicants", icon: Users },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Organization profile", to: "/profile", icon: Building2 },
];

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const user = getUser();
  const navItems = user?.role === "organization" ? organizationNavItems : volunteerNavItems;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={navItems} />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 capitalize">{today}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}