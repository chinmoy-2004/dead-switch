import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Shield, Plus, Activity, Clock, Menu, X, LogOut, User, Settings, Save, ArrowLeft } from "lucide-react";
import useAuthstore from "../store/useAuthstore.js";

const EditSwitch = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
   const {logout}=useAuthstore();

  const [formData, setFormData] = useState({
    title: "Emergency Contact",
    description: "Notify family members in case of emergency",
    pingInterval: "daily",
    expiryTime: "24",
    messageType: "email",
    message: "This is an automated message from John Doe's Dead Man Switch. If you are receiving this, it means I have not checked in as scheduled and something may have happened. Please check on my welfare and contact the appropriate authorities if necessary.\n\nImportant contacts:\n- Emergency: 911\n- My doctor: Dr. Smith (555-0123)\n- Work: Jane Manager (555-0456)\n\nThis message was triggered because I failed to check in by the scheduled time.",
    recipients: ["family@example.com", "emergency@example.com"]
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuth || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    // In a real app, fetch the switch data here based on the ID
  }, [navigate]);

 const handleLogout = async() => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/dashboard/switches/${id}`);
    }, 1000);
  };

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, ""]
    }));
  };

  const updateRecipient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => i === index ? value : recipient)
    }));
  };

  const removeRecipient = (index) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  if (!user) return null;

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
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link to={`/dashboard/switches/${id}`} className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Switch</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Update Switch Configuration</h2>
                <p className="text-gray-600 mt-1">Modify your dead man switch settings and messages.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Switch Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Emergency Contact"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this switch is for..."
                  />
                </div>

                {/* Timing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ping Interval *
                    </label>
                    <select
                      value={formData.pingInterval}
                      onChange={(e) => setFormData(prev => ({ ...prev, pingInterval: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="every6hours">Every 6 Hours</option>
                      <option value="every12hours">Every 12 Hours</option>
                      <option value="daily">Daily</option>
                      <option value="every3days">Every 3 Days</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grace Period (hours) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="168"
                      value={formData.expiryTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="24"
                    />
                    <p className="text-xs text-gray-500 mt-1">Time after missed ping before trigger</p>
                  </div>
                </div>

                {/* Message Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type *
                  </label>
                  <select
                    value={formData.messageType}
                    onChange={(e) => setFormData(prev => ({ ...prev, messageType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="webhook">Webhook/API Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.messageType === 'email' ? 
                      "Enter the message that will be sent if you don't check in..." :
                      formData.messageType === 'sms' ?
                      "Enter SMS text (160 characters max)..." :
                      "Enter webhook URL and payload..."
                    }
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients *
                  </label>
                  {formData.recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <input
                        type={formData.messageType === 'email' ? 'email' : 'text'}
                        required
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={formData.messageType === 'email' ? 
                          "email@example.com" : 
                          formData.messageType === 'sms' ?
                          "+1234567890" :
                          "https://api.example.com/webhook"
                        }
                      />
                      {formData.recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="ml-3 px-3 py-3 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add another recipient
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Link
                    to={`/dashboard/switches/${id}`}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Updating..." : "Update Switch"}
                  </button>
                </div>
              </form>
            </div>
          </div>
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

export default EditSwitch;
