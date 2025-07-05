import { TooltipProvider } from "./components/Tooltip.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Switches from "./pages/allSwitches.jsx";
import NewSwitch from "./pages/NewSwitch.jsx";
import SwitchDetails from "./pages/Switchdetail.jsx";
import EditSwitch from "./pages/Editswitch.jsx";
import Profile from "./pages/Profile.jsx";
// import ActivityLogs from "./pages/ActivityLogs.jsx";
import NotFound from "./pages/Notfound.jsx";
import { Toaster } from "react-hot-toast";
import useAuthstore from "./store/useAuthstore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import TermsOfService from "./pages/Terofserveice.jsx";
import PrivacyPolicy from "./pages/Privacypolicy.jsx";




const App = () => {

  const { checkauth } = useAuthstore();
  useEffect(() => {
    checkauth();
  }, [checkauth]);

  const authuser = useAuthstore((state) => state.authuser);
  const isCheckingauth = useAuthstore((state) => state.isCheckingauth);

  useEffect(() => {
    if (authuser) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: authuser.name,
        email: authuser.email
      }));

    }
  })

  if (isCheckingauth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!authuser ? <Landing /> : <Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={authuser ? <Dashboard /> : <Login />} />
          <Route path="/dashboard/switches" element={<Switches />} />
          <Route path="/dashboard/switches/new" element={<NewSwitch />} />
          <Route path="/dashboard/switches/:id" element={<SwitchDetails />} />
          <Route path="/dashboard/switches/:id/edit" element={<EditSwitch />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          {/* <Route path="/dashboard/logs" element={<ActivityLogs />} /> */}
          <Route path="*" element={<NotFound />} />
          <Route path="/termsofservice" element={<TermsOfService/>}/>
          <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
};

export default App;
