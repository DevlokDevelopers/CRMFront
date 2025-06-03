import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import styles from "./AdminLeads.module.css"; // reuse existing styling

const AdminColdData = () => {
  const [coldData, setColdData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchColdData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://devlokdevelopers.com/get_cold_data/");
      setColdData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cold data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColdData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`https://devlokdevelopers.com/delete_cold_data/${id}/`);
      setColdData((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.title}>Cold Data Entries ({coldData.length})</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Ser. No</th>
                  <th>Name & Phone</th>
                  <th>Property Listing</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coldData.length === 0 ? (
                  <tr>
                    <td colSpan="4">No data available.</td>
                  </tr>
                ) : (
                  coldData.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>{entry.name_phone}</td>
                      <td>{entry.property_listing}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                        >
                          {deletingId === entry.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminColdData;
