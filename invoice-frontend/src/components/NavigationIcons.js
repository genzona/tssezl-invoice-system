import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaSyncAlt } from "react-icons/fa";

const NavigationIcons = () => {
  const navigate = useNavigate();

  return (
    <div className="nav-icons">
      <button title="Home" onClick={() => navigate("/")}>
        <FaHome />
      </button>
      <button title="Back" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>
      <button title="Refresh" onClick={() => window.location.reload()}>
        <FaSyncAlt />
      </button>
    </div>
  );
};

export default NavigationIcons;
