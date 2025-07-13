import React, { useEffect, useState } from "react";
import NavigationIcons from "./NavigationIcons";
import "../styles/StatusPage.css";

const StatusPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("Login required");

        const res = await fetch("http://localhost:5000/api/invoices/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error("🔴 Fetch error:", err.message);
        setError(err.message);
      }
    };

    fetchInvoices();
  }, []);

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoices/download/excel", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoices.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
         <NavigationIcons />
         <img src="/logo.png" alt="Company Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="Company Logo" className="logo-top-right" />
      <h2>Status Page (Accounts Only)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && (
        <>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Ref Code</th>
                <th>Department</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
                <th>PDFs</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.referenceCode}</td>
                  <td>{inv.department}</td>
                  <td>{inv.item}</td>
                  <td>{inv.amount}</td>
                  <td>{inv.status}</td>
                  <td>
                    {inv.pdfs.map((file, i) => (
                      <div key={i}>
                        <a
                          href={`http://localhost:5000/uploads/${file}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          PDF {i + 1}
                        </a>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadExcel} style={{ marginTop: "20px" }}>
            Download Excel
          </button>
        </>
      )}
    </div>
  );
};

export default StatusPage;
