import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import NavigationIcons from "./NavigationIcons";


const CFODashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/invoices/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError("Server error: " + err.message);
      }
    };

    fetchInvoices();
  }, []);

  const handleDecision = async (id, decision) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/decision/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decision }),
      });

      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv._id !== id));
      } else {
        alert("Failed to update invoice");      
      }
    } catch (err) {
      console.error("Decision error:", err);
      alert("Error updating invoice");
    }
  };

  return (
    <div className="dashboard-container">
            <NavigationIcons />
            <img src="/logo.png" alt="Company Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="Company Logo" className="logo-top-right" />
      <h2>CFO Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Ref Code</th>
            <th>Department</th>
            <th>Item</th>
            <th>Amount</th>
            <th>PDFs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.referenceCode}</td>
              <td>{inv.department}</td>
              <td>{inv.item}</td>
              <td>{inv.amount}</td>
              <td>
                {inv.pdfs.map((pdf, idx) => (
                  <div key={idx}>
                    <a
                      href={`http://localhost:5000/uploads/${pdf}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      PDF {idx + 1}
                    </a>
                  </div>
                ))}
              </td>
              <td className="dashboard-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleDecision(inv._id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleDecision(inv._id, "reject")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CFODashboard;
