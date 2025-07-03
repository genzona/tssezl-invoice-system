import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import RaiseInvoice from "./components/RaiseInvoice";
import StatusLogin from "./components/StatusLogin";
import StatusPage from "./components/StatusPage";
import CFODashboard from "./components/CFODashboard";
import MDDashboard from "./components/MDDashboard";
import HeadDashboard from "./components/HeadDashboard";
import ChiefDashboard from "./components/ChiefDashboard";

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role) => {
    const normalizedRole = role.toUpperCase();
    console.log("🎯 Role:", normalizedRole);

    if (normalizedRole === "CFO") navigate("/cfo-dashboard");
    else if (normalizedRole === "MD") navigate("/md-dashboard");
    else if (normalizedRole === "ACCOUNTS") navigate("/status");
    else if (normalizedRole === "CHIEF") navigate("/chief-dashboard");
    else if (normalizedRole.startsWith("HEAD")) navigate("/head-dashboard");
    else navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/raise-invoice" element={<RaiseInvoice />} />
      <Route path="/status-login" element={<StatusLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/status" element={<StatusPage />} />
      <Route path="/cfo-dashboard" element={<CFODashboard />} />
      <Route path="/md-dashboard" element={<MDDashboard />} />
      <Route path="/head-dashboard" element={<HeadDashboard />} />
      <Route path="/chief-dashboard" element={<ChiefDashboard />} />
    </Routes>
  );
}

export default App;
