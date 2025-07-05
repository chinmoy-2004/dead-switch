import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Shield, Activity, Clock, Menu, X, LogOut, User, Settings, Edit, Trash2, ArrowLeft, AlertCircle, Loader2, RefreshCw, Loader } from "lucide-react";
import useAuthstore from "../store/useAuthstore.js";
import useSwitchStore from "../store/useSwitchstore.js";
import usePayloadStore from "../store/usepayloadstore.js";


const SwitchDetails = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuthstore();
  const { isswitchfetching, switchdata, getSwitchById, deleteSwitch,pingSwitch,isswitchpinging } = useSwitchStore();
  const { payloaddata, getpayloadbyid, ispayloadfetching } = usePayloadStore();

  // Helper functions for formatting
  const formatInterval = (minutes) => {
    if (!minutes) return "Not set";

    const years = Math.floor(minutes / (60 * 24 * 365));
    const days = Math.floor((minutes % (60 * 24 * 365)) / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;

    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
    if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (mins > 0) result.push(`${mins} minute${mins > 1 ? 's' : ''}`);

    return result.join(' ') || 'Less than a minute';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSwitchById(id);
      await getpayloadbyid(id);
    };

    const isAuth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuth || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchData();
  }, [id, navigate, getSwitchById, getpayloadbyid]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePingNow = async() => {
     await pingSwitch(id);
     await getSwitchById(id);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this switch? This action cannot be undone.')) {
      await deleteSwitch(id);
      navigate('/dashboard/switches');
    }
  };

  if (!user) return null;

  if (isswitchfetching || ispayloadfetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-lg text-gray-700">Loading switch details...</p>
        </div>
      </div>
    );
  }


  // Switch data with formatted values
  const switchData = {
    id: switchdata?._id,
    title: switchdata?.name,
    description: switchdata?.description,
    status: switchdata?.status,
    trigger: formatInterval(switchdata?.interval),
    messageType: "Email",
    message: payloaddata?.decryptedText, // Placeholder for actual message content
    recipients: payloaddata?.payload.target || [],
    createdAt: formatDate(switchdata?.createdAt),
    lastPing: formatDateTime(switchdata?.lastping)
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
      {switchdata && payloaddata ? (
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              {/* Left side - menu button, back button, and title (mobile only shows icon) */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <Link
                  to="/dashboard/switches"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="sm:block">
                  <h1 className="text-lg font-bold text-gray-900 line-clamp-1 max-w-[120px] sm:max-w-none sm:text-2xl">
                    {switchData.title}
                  </h1>
                  {/* Status - hidden on mobile, shown on desktop */}
                  <div className="hidden sm:flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${switchData.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {switchData.status}
                    </span>
                    <span className="text-sm text-gray-500 ml-3">
                      Last ping: {switchData.lastPing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - action buttons (mobile shows icons only) */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={handlePingNow}
                  className="p-2 sm:px-4 sm:py-2 flex justify-center items-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label="Ping Now"
                >
                  {isswitchpinging ? (
                    <Loader  className="w-4 h-4 animate-spin sm:mr-2" />
                  ) : (
                    <Activity  className="w-4 h-4 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">{switchData.status==="active"?`Ping Now`:`Activate Now`}</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 sm:px-4 sm:py-2 border  flex justify-center items-center border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            {/* Mobile status bar - appears only on mobile below the main header */}
            <div className="sm:hidden px-4 pb-2 flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${switchData.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
                }`}>
                {switchData.status}
              </span>
              <span className="text-xs text-gray-500 truncate">
                Ping: {switchData.lastPing}
              </span>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Interval</p>
                      <p className="text-lg font-semibold text-gray-900">{switchData.trigger}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <User className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Recipients</p>
                      <p className="text-lg font-semibold text-gray-900">{switchData.recipients.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Created On</p>
                      <p className="text-lg font-semibold text-gray-900">{switchData.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Switch Details */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Switch Configuration</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-gray-900">{switchData.description || "No description provided"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                      <p className="text-gray-900">{switchData.messageType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                      <p className="text-gray-900">{switchData.createdAt}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Ping</label>
                      <p className="text-gray-900">{switchData.lastPing}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <div className="space-y-2">
                      {switchData.recipients.length > 0 ? (
                        switchData.recipients.map((recipient, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <User className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{recipient}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-500">No recipients configured</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {switchData.message ? (
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">{switchData.message}</pre>
                      ) : (
                        <p className="text-gray-500">No message content</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 z-30">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Service Unavailable</h2>
            <p className="mt-2 text-gray-600">
              We're having trouble connecting to our servers. Please check your internet connection and try again later.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </div>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retry
                </div>
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              If the problem persists, contact support at support@deadswitch.com
            </div>
          </div>
        </div>
      )}

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

export default SwitchDetails;