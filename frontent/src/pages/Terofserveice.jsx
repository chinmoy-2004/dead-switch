import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const TermsOfService = () => {
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

      {/* Terms Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 bg-white rounded-lg shadow-md my-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Terms of Service</h1>
        
        <p className="mb-6 text-sm text-gray-500">Last updated: July 5, 2025</p>

        <div className="space-y-8 text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using DeadSwitch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
            <p>
              DeadSwitch allows users to create automated triggers that send messages or documents in the event of user inactivity. It is your responsibility to configure your switches accurately and update them as needed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use DeadSwitch only for lawful purposes and not to misuse the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data & Privacy</h2>
            <p>
              We take your data seriously. All user data is encrypted and never shared without explicit consent. Refer to our Privacy Policy for more details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Service Availability</h2>
            <p>
              We strive to provide uninterrupted service but do not guarantee 100% uptime. Scheduled maintenance and unforeseen technical issues may temporarily affect availability.
            </p>
          </div>


          <div>
            <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p>
              DeadSwitch is not liable for any indirect, incidental, or consequential damages resulting from your use of the service. Use the platform at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
            <p>
              We may update these Terms of Service occasionally. Continued use of DeadSwitch after any changes implies your acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, feel free to contact us at <a href="mailto:www.chinmoy.dev@gmail.com" className="text-blue-600 underline">www.chinmoy.dev@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
