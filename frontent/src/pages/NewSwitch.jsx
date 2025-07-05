import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Plus, Activity, Clock, Menu, X, LogOut, User, Settings, Save, ArrowLeft, Calendar } from "lucide-react";
import useAuthstore from "../store/useAuthstore.js";
import useSwitchStore from "../store/useSwitchstore.js";
import toast from "react-hot-toast";
import usePayloadStore from "../store/usepayloadstore.js";

const NewSwitch = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthstore();
  

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pingInterval: "daily",
    intervalType: "preset",
    customDate: "",
    customTime: "",
    messageType: "email",
    message: "",
    recipients: [""],
    attachments: [] // Add this line for file storage
  });


  const { addpayload,ispayloadcreating } = usePayloadStore();
  const { addSwitch,isswitchcreating } = useSwitchStore();

  // Calculate next ping time in hours from now
  const calculateNextPingHours = () => {
    const now = new Date();
    let nextPing = new Date();

    if (formData.intervalType === "custom" && formData.customDate && formData.customTime) {
      // Use custom date and time
      const [hours, minutes] = formData.customTime.split(':');
      nextPing = new Date(formData.customDate);
      nextPing.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // Use preset intervals
      switch (formData.pingInterval) {
        case "hourly":
          nextPing.setHours(now.getHours() + 1);
          break;
        case "every6hours":
          nextPing.setHours(now.getHours() + 6);
          break;
        case "every12hours":
          nextPing.setHours(now.getHours() + 12);
          break;
        case "daily":
          nextPing.setDate(now.getDate() + 1);
          break;
        case "every3days":
          nextPing.setDate(now.getDate() + 3);
          break;
        case "weekly":
          nextPing.setDate(now.getDate() + 7);
          break;
        case "monthly":
          nextPing.setMonth(now.getMonth() + 1);
          break;
        default:
          nextPing.setDate(now.getDate() + 1);
      }
    }

    // Calculate difference in mins
   const diffMs = nextPing - now;
   return Math.round(diffMs / (1000 * 60)); 
  };



  // Get minimum date for calendar (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time for today
  const getMinTime = () => {
    const now = new Date();
    if (formData.customDate === getMinDate()) {
      // If selected date is today, minimum time is current time + 1 hour
      const minTime = new Date(now);
      minTime.setHours(minTime.getMinutes() + 1);
      return minTime.toTimeString().slice(0, 5);
    }
    return "00:00";
  };

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

  const handleIntervalTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      intervalType: type,
      customDate: type === "custom" ? getMinDate() : "",
      customTime: type === "custom" ? "09:00" : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Validate custom date/time if selected
    if (formData.intervalType === "custom") {
      const customDateTime = new Date(`${formData.customDate}T${formData.customTime}`);
      const now = new Date();

      if (customDateTime <= now) {
        toast.error("Custom date and time must be in the future");
        
        return;
      }
    }

    // Calculate hours until next ping for submission
    const hoursUntilNextPing = calculateNextPingHours();

    if (!formData.title || !formData.message || formData.recipients.length === 0) {
      toast.error("please fill mandatory files")
      return;
    }

    const submissionData = {
      ...formData,
      hoursUntilNextPing,
    };


    console.log("Switch Configuration:", submissionData);

    const swichedata = new FormData();
    swichedata.append("name", submissionData.title);
    if(submissionData.description.trim!=="")swichedata.append("description", submissionData.description);
    swichedata.append("interval", submissionData.hoursUntilNextPing);

    const sw = await addSwitch(swichedata);

    if (!sw) {
      return;
    }
    else {
      const payloaddata = new FormData();
      payloaddata.append("switchId", sw._id);
      submissionData.recipients.forEach(email => {
        payloaddata.append('target', email);
      });

      payloaddata.append("rawdata", submissionData.message);
      for (const file of submissionData.attachments) {
        payloaddata.append("attachments", file);
      }
      await addpayload(payloaddata);
    }

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

  const nextPingHours = calculateNextPingHours();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 7 * 1024 * 1024; // 7MB in bytes

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the 7MB limit. Please select smaller files.`);
      return;
    }

    // Add new files to existing attachments
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
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
              <Link to="/dashboard/switches" className="flex items-center px-4 py-3  bg-blue-50 text-blue-700 rounded-lg">
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
              <Link to="/dashboard/switches" className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create New Switch</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Switch Configuration</h2>
                <p className="text-gray-600 mt-1">Set up your dead man switch with custom triggers and messages.</p>
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

                {/* Timing Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ping Schedule *
                  </label>

                  {/* Interval Type Toggle */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => handleIntervalTypeChange("preset")}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${formData.intervalType === "preset"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Preset Intervals
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIntervalTypeChange("custom")}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${formData.intervalType === "custom"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Custom Date/Time
                    </button>
                  </div>

                  {/* Preset Intervals */}
                  {formData.intervalType === "preset" && (
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
                  )}

                  {/* Custom Date/Time */}
                  {formData.intervalType === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Ping Date *
                        </label>
                        <input
                          type="date"
                          required
                          min={getMinDate()}
                          value={formData.customDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, customDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Ping Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.customTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, customTime: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Timing Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Timing Preview</h3>
                  <div className="text-sm text-blue-800">
                    <p><strong>Next ping will occur in:</strong> {nextPingHours} mins</p>
                  </div>
                </div>

                {/* Message Configuration
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
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.messageType === 'email' ?
                      "Enter the message that will be sent if you don't check in..." :
                      formData.messageType === 'sms' ?
                        "Enter SMS text (160 characters max)..." :
                        "Enter webhook URL and payload..."
                    }
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Max 7MB each)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> 
                        </p>
                        <p className="text-xs text-gray-500">Multiple files allowed (Max 7MB each)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Display selected files */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                      <ul className="divide-y divide-gray-200">
                        {formData.attachments.map((file, index) => (
                          <li key={index} className="py-2 flex items-center justify-between">
                            <div className="flex items-center space-x-3 truncate">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="ml-2 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                    to="/dashboard/switches"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={ispayloadcreating || isswitchcreating}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {ispayloadcreating || isswitchcreating ? "Creating..." : "Create Switch"}
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

export default NewSwitch;