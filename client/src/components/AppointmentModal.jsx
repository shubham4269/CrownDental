import React, { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import API from "../services/api";
import successAnim from "../assets/success.json";

export default function AppointmentModal({ isOpen, onClose }) {
  const [treatments, setTreatments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    treatment: "",
  });

  // Fetch treatments
  useEffect(() => {
    API.get("/treatments").then((res) => setTreatments(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await API.post("/appointments", form);

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* SUCCESS ANIMATION */}
        {success && (
          <div style={styles.successContainer}>

            <div
              style={{
                fontSize: "52px",
                color: "#4CAF50",
                marginBottom: "-4px",
                fontWeight: "900",
              }}
            >
              ✓
            </div>

            <Player
              autoplay
              loop={false}
              src={successAnim}
              style={{ height: "150px", width: "150px" }}
            />

            <h3 style={{ color: "#6f6048", marginTop: "-8px" }}>
              Booked Successfully!
            </h3>
          </div>
        )}

        {/* FORM */}
        {!success && (
          <>
            <h2 style={styles.heading}>Book Appointment</h2>

            <form onSubmit={submit}>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <select
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Treatment</option>
                {treatments.map((t) => (
                  <option key={t._id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes popup {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    zIndex: 999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "95%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    animation: "popup 0.3s ease",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    border: "1px solid #e5ddc8",
  },

  heading: {
    textAlign: "center",
    color: "#6f6048",
    fontWeight: 800,
    fontSize: "24px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid #d3c8b3",
    background: "#f5f1e6",
    fontSize: "15px",
    outline: "none",
    transition: "0.25s ease",
  },

  btn: {
    width: "100%",
    padding: "14px",
    background: "#6f6048",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "6px",
    transition: "0.25s ease",
  },

  successContainer: {
    textAlign: "center",
    padding: "10px 0",
  },
};

