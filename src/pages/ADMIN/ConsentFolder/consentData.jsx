import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import styles from "./consentData.module.css";
import { ShieldCheck } from "lucide-react";

const ConsentList = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(consents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consents.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <ShieldCheck size={20} color="#3b82f6" />
          <h2 className={styles.title}>Consent Submissions ({consents.length})</h2>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            {/* Table layout for desktop */}
            <div className={styles.desktopTable}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>IP Address</th>
                      <th>User Agent</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.ip_address}</td>
                        <td>
                          <pre className={styles.userAgent}>{item.user_agent}</pre>
                        </td>
                        <td>{new Date(item.submitted_at).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric"
})}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card layout for mobile */}
            <div className={styles.mobileCards}>
              {currentItems.map((item, index) => (
                <div key={index} className={styles.cardItem}>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Address:</strong> {item.address}</p>
                  <p><strong>IP Address:</strong> {item.ip_address}</p>
                  <p><strong>User Agent:</strong></p>
                  <pre className={styles.userAgent}>{item.user_agent}</pre>
                  <p><strong>Submitted At:</strong> {new Date(item.submitted_at).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric"
})}</p>

                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.activePage : ""}`}
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
