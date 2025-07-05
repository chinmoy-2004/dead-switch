
import { use, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Plus, Activity, Clock, Menu, X, LogOut, User, Settings, Eye, Loader } from "lucide-react";
import useAuthstore from "../store/useAuthstore.js";
import useSwitchStore from "../store/useSwitchstore.js";


const Switches = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthstore();
  const { fetchSwitches, pingSwitch, isfetching, isswitchpinging } = useSwitchStore();
  const activeswitches = useSwitchStore((state) => state.activeswitches);
  const expiredswitches = useSwitchStore((state) => state.expiredswitches);
  const allswitches=useSwitchStore((state)=>state.allswitches)


  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuth || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSwitches();
        console.log("Switches fetched successfully");
      } catch (error) {
        console.error("Error fetching switches:", error);
      }
    }
    fetchData();

  }, []);


  if (!user) return null;

  const handleping = async (switchId) => {
    await pingSwitch(switchId);
  }

  const formatInterval = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);

    return parts.join(" ");
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
              <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Activity className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/switches" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Switches</h1>
            <Link
              to="/dashboard/switches/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Switch
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats */}
          {isfetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading switches...</span>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="text-2xl font-bold text-gray-900">{activeswitches.length + expiredswitches.length}</div>
                  <div className="text-sm text-gray-600">Total Switches</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="text-2xl font-bold text-green-600">{activeswitches.length}</div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="text-2xl font-bold text-yellow-600">{expiredswitches.length}</div>
                  <div className="text-sm text-gray-600">Expired</div>
                </div>
              </div>

              {/* Switches List */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">All Switches</h3>
                </div>
                <div className="divide-y">
                  {allswitches.map((switchItem) => (
                    <div key={switchItem._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900 mr-3">{switchItem.name}</h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${switchItem.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {switchItem.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{switchItem.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              interval: {formatInterval(switchItem.interval)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {switchItem.status==="active" && (<button
                            onClick={() => handleping(switchItem._id)}
                            disabled={isswitchpinging}
                            className="md:flex hidden items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isswitchpinging ? (
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Activity className="w-4 h-4 mr-2" />
                            )}
                            Ping Now
                          </button>)}
                          <Link
                          
                            to={`/dashboard/switches/${switchItem._id}`}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* Empty State for when no switches exist */}
              {activeswitches.length === 0 && expiredswitches.length === 0 && !isfetching && (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No switches yet</h3>
                  <p className="text-gray-600 mb-6">Create your first dead man switch to get started.</p>
                  <Link
                    to="/dashboard/switches/new"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Switch
                  </Link>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Overlay */}
     {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-lg bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Switches;