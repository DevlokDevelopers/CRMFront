import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import styles from "./AdminColdData.module.css";

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
      <div className={styles["cold-container"]}>
        <h2 className={styles["cold-title"]}>
          ❄️ Cold Data Entries ({coldData.length})
        </h2>
        {error && <p className={styles["cold-error"]}>{error}</p>}
        {loading ? (
          <p className={styles["cold-loading"]}>Loading...</p>
        ) : (
          <div className={styles["cold-table-wrapper"]}>
            <table className={styles["cold-data-table"]}>
              <thead>
                <tr>
                  <th>Ser. No</th>
                  <th>Name & Phone</th>
                  <th>Property Listing</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coldData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles["cold-empty"]}>
                      No data available.
                    </td>
                  </tr>
                ) : (
                  coldData.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>{entry.name_phone}</td>
                      <td>{entry.property_listing}</td>
                      <td>{entry.date || entry.created_at || "N/A"}</td>
                      <td>
                        <button
                          className={styles["cold-delete-btn"]}
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
