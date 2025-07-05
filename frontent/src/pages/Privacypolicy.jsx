import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          <span className="text-xl md:text-2xl font-bold text-gray-900">DeadSwitch</span>
        </div>
        <div className="flex space-x-2 md:space-x-4">
          <Link to="/login" className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="px-3 py-1 md:px-6 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Privacy Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 bg-white rounded-lg shadow-md my-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
        <p className="mb-6 text-sm text-gray-500">Last updated: July 5, 2025</p>

        <div className="space-y-8 text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              At DeadSwitch, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We collect personal information you provide during account creation, including your name, email address, and any content you configure in your switches (e.g., messages, documents, recipient emails).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
              <li>To provide and manage your account</li>
              <li>To deliver messages when your switch triggers</li>
              <li>To improve platform functionality and performance</li>
              <li>To communicate service updates or security notices</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Encryption & Security</h2>
            <p>
              All sensitive data is encrypted both in transit and at rest using modern encryption standards. Only you and your designated recipients can access message contents.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Sharing of Information</h2>
            <p>
              We never sell or rent your data. Your information is only shared with your selected recipients when a switch is triggered. We may share data if legally required to do so under applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
            <p>
              You have the right to access, or delete your switch at any time. You can also cancel your account and request permanent deletion of all stored data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Cookies & Analytics</h2>
            <p>
              We use basic cookies and anonymous analytics to improve user experience. We do not track or profile users across third-party sites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page, and continued use of the platform implies acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, contact us at <a href="mailto:www.chinmoy.dev@gmail.com" className="text-blue-600 underline">www.chinmoy.dev@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
