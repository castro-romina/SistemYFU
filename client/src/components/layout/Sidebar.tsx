import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronRight, type LucideIcon } from "lucide-react";
import { getUser, logout } from "../../lib/auth";
import ModalConfirm from "../common/ModalConfirm";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export default function Sidebar({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200 flex items-center gap-2.5">
        <img src="/logofinal.png" alt="MatchVol" className="w-9 h-9 rounded-lg object-cover shrink-0" />
        <span className="font-display font-bold text-lg leading-none">
          <span className="text-purple-600">Match</span>
          <span className="text-pink-500">Vol</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = location.pathname.toLowerCase() === item.to.toLowerCase();
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: profile + settings */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>

        <Link
          to="/settings"
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Settings</span>
          </div>
          <ChevronRight size={16} className="text-purple-400" />
        </Link>
      </div>

      {showLogoutModal && (
        <ModalConfirm
  isOpen={showLogoutModal}
  title="Log out"
  message="Are you sure you want to log out?"
  confirmLabel="Log out"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={handleLogout}
  onCancel={() => setShowLogoutModal(false)}
/>
      )}
    </aside>
  );
}