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
                    <td>{item.submitted_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ConsentList;
