import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Plus, Activity, Menu, X, LogOut, User, Settings } from "lucide-react";
import useAuthStore from "../store/useAuthstore.js";
import useSwitchStore from "../store/useSwitchstore.js";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { isfetching, fetchSwitches, allswitches, activeswitches } = useSwitchStore();

  // Check authentication and load user data
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuth || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fetch switches data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSwitches();
      } catch (error) {
        console.error("Error fetching switches:", error);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;

  // Dashboard statistics
  const stats = [
    { 
      label: "Active Switches", 
      value: activeswitches?.length || 0, 
      icon: Activity, 
      color: "text-green-600 bg-green-100" 
    },
    { 
      label: "Total Switches", 
      value: allswitches?.length || 0, 
      icon: Shield, 
      color: "text-blue-600 bg-blue-100" 
    }
  ];

  // Get top 3 recent switches
  const recentSwitches = allswitches?.slice(0, 3).map(switchItem => ({
    id: switchItem._id,
    title: switchItem.name,
    status: switchItem.status,
    color: switchItem.status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800"
  }));

  const hasSwitches = allswitches && allswitches.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DeadSwitch</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-6">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
                <Activity className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/switches" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Switches
              </Link>
            </li>
            <li>
              <Link to="/dashboard/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5 mr-3" />
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Link
              to="/dashboard/switches/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Switch
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Banner */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">
              {hasSwitches 
                ? "Here's what's happening with your dead man switches."
                : "Get started by creating your first dead man switch."}
            </p>
          </div>

          {/* Statistics Cards - Only shown when switches exist */}
          {hasSwitches && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Switches Section */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {hasSwitches ? "Recent Switches" : "Your Switches"}
                </h3>
                {hasSwitches && (
                  <Link to="/dashboard/switches" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </Link>
                )}
              </div>
            </div>

            <div className="divide-y">
              {isfetching ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : hasSwitches ? (
                recentSwitches.map((switchItem) => (
                  <div key={switchItem.id} className="p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {switchItem.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${switchItem.color}`}>
                          {switchItem.status.charAt(0).toUpperCase() + switchItem.status.slice(1)}
                        </span>
                        <Link
                          to={`/dashboard/switches/${switchItem.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <Shield className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No switches created yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Dead man switches help you protect important messages by automatically sending them if you don't check in regularly.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/dashboard/switches/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Switch
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions - Only shown when no switches exist */}
          {!hasSwitches && !isfetching && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
                    <p className="text-blue-100">
                      Create your first dead man switch in just a few minutes and ensure your important messages are never lost.
                    </p>
                  </div>
                  <Link
                    to="/dashboard/switches/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Switch
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-lg bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;