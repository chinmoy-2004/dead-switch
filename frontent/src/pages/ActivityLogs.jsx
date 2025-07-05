import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Activity, Clock, Menu, X, LogOut, User, Settings, CheckCircle, AlertTriangle, XCircle, Filter } from "lucide-react";
import useAuthstore from "../store/useAuthstore.js";

const ActivityLogs = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
   const {logout}=useAuthstore();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuth || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = async() => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const activityLogs = [
    {
      id: 1,
      type: 'ping',
      status: 'success',
      message: 'Manual ping received for Emergency Contact',
      switchTitle: 'Emergency Contact',
      timestamp: '2024-01-20 14:30:15',
      details: 'User manually triggered ping from dashboard'
    },
    {
      id: 2,
      type: 'switch_created',
      status: 'success',
      message: 'New switch created: Travel Safety',
      switchTitle: 'Travel Safety',
      timestamp: '2024-01-20 10:15:00',
      details: 'Switch configured with 12-hour ping interval'
    },
    {
      id: 3,
      type: 'ping',
      status: 'success',
      message: 'Scheduled ping received for Business Handover',
      switchTitle: 'Business Handover',
      timestamp: '2024-01-19 09:15:30',
      details: 'Automatic ping received on schedule'
    },
    {
      id: 4,
      type: 'switch_edited',
      status: 'success',
      message: 'Switch updated: Emergency Contact',
      switchTitle: 'Emergency Contact',
      timestamp: '2024-01-19 08:22:45',
      details: 'Message content and recipients updated'
    },
    {
      id: 5,
      type: 'ping',
      status: 'late',
      message: 'Late ping received for Digital Estate',
      switchTitle: 'Digital Estate',
      timestamp: '2024-01-18 09:45:12',
      details: 'Ping received 30 minutes after deadline'
    },
    {
      id: 6,
      type: 'switch_paused',
      status: 'warning',
      message: 'Switch paused: Travel Safety',
      switchTitle: 'Travel Safety',
      timestamp: '2024-01-17 16:00:00',
      details: 'User manually paused switch'
    },
    {
      id: 7,
      type: 'ping',
      status: 'success',
      message: 'Scheduled ping received for Emergency Contact',
      switchTitle: 'Emergency Contact',
      timestamp: '2024-01-17 09:08:22',
      details: 'Automatic ping received on schedule'
    },
    {
      id: 8,
      type: 'account',
      status: 'success',
      message: 'Profile information updated',
      switchTitle: null,
      timestamp: '2024-01-16 14:20:00',
      details: 'Name and email address updated'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'late':
        return 'text-orange-600 bg-orange-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
      case 'late':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const filteredLogs = filterType === 'all' 
    ? activityLogs 
    : activityLogs.filter(log => log.type === filterType);

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
            <li>
              <Link to="/dashboard/logs" className="flex items-center px-4 py-3  bg-blue-50 text-blue-700 rounded-lg">
                <Clock className="w-5 h-5 mr-3" />
                Activity Log
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
            <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="ping">Pings</option>
                  <option value="switch_created">Switch Created</option>
                  <option value="switch_edited">Switch Edited</option>
                  <option value="switch_paused">Switch Paused</option>
                  <option value="account">Account</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">42</div>
              <div className="text-sm text-gray-600">Successful Pings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Late Pings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Switch Changes</div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 mt-1">Complete log of all actions and events.</p>
            </div>
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${getStatusColor(log.status)} mr-4 flex-shrink-0`}>
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{log.message}</h4>
                        <span className="text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                      {log.switchTitle && (
                        <p className="text-sm text-blue-600 mb-1">Switch: {log.switchTitle}</p>
                      )}
                      <p className="text-sm text-gray-600">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">No activities match your current filter.</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredLogs.length > 0 && (
            <div className="mt-6 text-center">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Load More Activity
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ActivityLogs;
