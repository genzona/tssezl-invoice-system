import React, { useEffect, useState } from "react";
import NavigationIcons from "./NavigationIcons";
import "../styles/Dashboard.css";

const HeadDashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/invoices/pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setInvoices)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDecision = async (id, decision) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/invoices/decision/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ decision }),
    });
    setInvoices(invoices.filter((inv) => inv._id !== id));
  };

  return (
    <div className="dashboard-container">
      <NavigationIcons />
      <h2>Department Head Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Ref Code</th>
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
              <td>{inv.item}</td>
              <td>{inv.amount}</td>
              <td>
                {inv.pdfs.map((pdf, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5000/uploads/${pdf}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View {idx + 1}
                  </a>
                ))}
              </td>
              <td>
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

export default HeadDashboard;
