import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Smart Leads Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
            {user?.role}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>

          <p className="text-gray-600">You are logged in as: {user?.role}</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
