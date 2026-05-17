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
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Leads Dashboard</h1>

            <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-black text-white text-sm px-3 py-1 rounded-full">
              {user?.role}
            </span>

            <button
              onClick={handleLogout}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6">
        <Leads />
      </main>
    </div>
  );
};

export default Dashboard;
