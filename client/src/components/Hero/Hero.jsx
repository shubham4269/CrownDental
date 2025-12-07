import React from "react";
import { useAppointment } from "../../context/AppointmentContext";
import "./Hero.css";

const Hero = () => {
  const { openModal } = useAppointment(); 
  return (
    <section
      className="hero"
      style={{
        backgroundImage: 'url("/Images/herobg.jpg")',
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container hero-inner">

        {/* Logo */}
        <div className="hero-logo reveal-on-scroll">
          <img
            src="/Images/logo.png"
            alt="Crown Dental Logo"
            className="hero-logo-img"
          />
        </div>

        {/* Title */}
        <h1 className="hero-title reveal-on-scroll">
          Experience Dental Care Without Fear
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle reveal-on-scroll">
          At Crown Dental Hospital, we combine clinical excellence with genuine compassion.
          Our modern facility, expert team, and painless procedures ensure your comfort at every step.
        </p>

        {/* Buttons */}
        <div className="hero-cta-group reveal-on-scroll">
          <button className="btn-primary" onClick={openModal}>
            Book Appointment
          </button>

          <a href="tel:+15555550199" className="btn-secondary">Call Now</a>
        </div>

        {/* Trust Badges */}
        <div className="hero-trust-badges reveal-on-scroll">
          <span className="badge">⭐ 4.9/5 Rating</span>
          <span className="badge">✓ 10,000+ Happy Patients</span>
          <span className="badge">✓ 15+ Years Excellence</span>
        </div>

      </div>
    </section>
  );
};

export default Hero;

