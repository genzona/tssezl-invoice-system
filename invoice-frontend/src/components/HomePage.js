import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <img src="/logo.png" alt="Company Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="Company Logo" className="logo-top-right" />
     <div className="homepage-content">
        <h1>Internal Invoice System</h1>
        <div className="button-group">
          <button onClick={() => navigate("/raise-invoice")}>Raise-Invoice</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/status-login")}>Status</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
