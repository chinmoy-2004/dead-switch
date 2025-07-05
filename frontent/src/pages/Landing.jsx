import { Link } from "react-router-dom";
import { Shield, Clock, Bell, Users, ArrowRight, Check } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Secure Your Secrets.
          <span className="text-blue-600 block">Stay in Control.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create automated triggers that activate when you don't check in. Perfect for emergency notifications,
          sensitive information sharing, and peace of mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4  bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/login" className="px-8 py-4 border-2  border-gray-300 text-gray-700 text-lg rounded-lg hover:border-gray-400 transition-colors">
            Log In
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
      </section>

      {/* How It Works */}
      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Your Schedule</h3>
              <p className="text-gray-600">Configure when and how often you need to check in to keep your switches active.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Stay Active</h3>
              <p className="text-gray-600">Regular check-ins keep your switches from triggering. Miss a check-in and your messages activate.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto-Trigger</h3>
              <p className="text-gray-600">When you don't check in, your pre-written messages are automatically sent to your chosen recipients.</p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { title: "Multiple Recipients", desc: "Send messages to one or many trusted contacts." },
              { title: "End-to-End Encryption", desc: "Your data stays private – only you and your recipients see the message." },
            ].map((feature) => (
              <div key={feature.title} className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Perfect For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Emergency Contacts", desc: "Notify loved ones if you’re unreachable." },
              { title: "Business Continuity", desc: "Automatically pass on critical data if unavailable." },
              { title: "Digital Estate Planning", desc: "Securely share credentials or wishes posthumously." },
              { title: "Travel Safety", desc: "Trigger alerts if you go off the radar while traveling." },
              { title: "Important Documents", desc: "Ensure documents are released when needed." },
              { title: "Account Information", desc: "Send passwords or login details when necessary." },
              { title: "Family Messages", desc: "Deliver heartfelt messages if something happens." },
              { title: "Professional Handoffs", desc: "Ensure your work is passed on if you’re unavailable." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-lg shadow-sm">
                <Check className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-4 text-blue-100">
            Join thousands who trust DeadSwitch with their most important messages.
          </p>
          <p className="text-sm mb-8 text-blue-200">Secure. Private. Built for peace of mind.</p>
          <Link to="/signup" className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center">
            Create Your Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">DeadSwitch</span>
              </div>
              <p className="text-sm">Secure, reliable, and always watching out for you.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 DeadSwitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
