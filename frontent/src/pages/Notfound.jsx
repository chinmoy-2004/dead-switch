import { Link } from "react-router-dom";
import { Shield, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Shield className="w-12 h-12 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">DeadSwitch</span>
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Need help?</p>
          <div className="flex justify-center space-x-4">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Support</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
