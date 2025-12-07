import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AppointmentForm() {
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",   
    phone: "",
    treatment: "",
    date: "",
    time: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/treatments").then(res => setTreatments(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    await API.post("/appointments", form);
    setSuccess(true);

    setForm({
      name: "",
      email: "",  
      phone: "",
      treatment: "",
      date: "",
      time: "",
      message: "",
    });

    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div style={{
      paddingTop: "140px",
      background: "#faf6ed",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      paddingBottom: "50px",
    }}>
      <div style={{
        background: "white",
        width: "90%",
        maxWidth: "550px",
        padding: "35px 30px",
        borderRadius: "16px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#8b5e3c",
          fontSize: "2rem",
          marginBottom: "20px",
          fontWeight: 700,
        }}>Book Appointment</h2>

        {success && (
          <div style={{
            background: "#d4f8d4",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "15px",
            color: "#2d7a2d",
            fontWeight: 600,
          }}>
            Appointment Submitted Successfully ✓
          </div>
        )}

        <form onSubmit={submitForm}>
          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* PHONE */}
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* TREATMENT */}
          <select
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Treatment</option>
            {treatments.map((t) => (
              <option key={t._id} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>

          {/* DATE */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* TIME */}
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* MESSAGE */}
          <textarea
            name="message"
            placeholder="Message (Optional)"
            value={form.message}
            onChange={handleChange}
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#8b5e3c",
              color: "white",
              padding: "15px",
              fontSize: "1.1rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: 600,
            }}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #c9b9a7",
  background: "#fdfbf7",
  fontSize: "1rem",
};

