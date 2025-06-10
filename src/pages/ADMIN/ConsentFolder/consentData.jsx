import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import "./consentData.css"; // We'll define basic styling below

const ConsentList = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const response = await axios.get("https://devlokdevelopers.com/get_consent_data/");
        setConsents(response.data.consents);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch consent data.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(consents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consents.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="consent-container">
        <h2 className="consent-title">Consent Submissions ({consents.length})</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="consent-grid">
              {currentItems.map((item, index) => (
                <div key={index} className="consent-card">
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Address:</strong> {item.address}</p>
                  <p><strong>IP Address:</strong> {item.ip_address}</p>
                  <p><strong>User Agent:</strong></p>
                  <pre className="user-agent">{item.user_agent}</pre>
                  <p><strong>Submitted At:</strong> {item.submitted_at}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};


export default ConsentList;
