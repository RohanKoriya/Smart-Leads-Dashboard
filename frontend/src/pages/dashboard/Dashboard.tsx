import { useNavigate } from "react-router-dom";

import Leads from "./Leads";

import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* TOP NAVIGATION */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 10L10 3L17 10L10 17L3 10Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle cx="10" cy="10" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">
              LeadFlow
            </span>
            <div className="hidden sm:block w-px h-4 bg-zinc-200 mx-1" />
            <span className="hidden sm:block text-sm text-zinc-500">
              Dashboard
            </span>
          </div>

          {/* Right: User info + actions */}
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span
              className={`hidden sm:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${
                user?.role === "admin"
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-sky-50 text-sky-700 border-sky-200"
              }`}
            >
              {user?.role === "admin" ? "Admin" : "Sales"}
            </span>

            {/* User avatar + name */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-zinc-700">
                {user?.name || "User"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-zinc-200" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* PAGE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Leads />
      </main>
    </div>
  );
};

export default Dashboard;
