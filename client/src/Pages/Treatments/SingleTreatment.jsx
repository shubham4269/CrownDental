import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import staticProcedures from "../../data/staticProcedures"; 
import { useAppointment } from "../../context/AppointmentContext";
import LeadForm from "../../components/LeadForm";


export default function SingleTreatment() {
  const { slug } = useParams();
  const { openModal } = useAppointment();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openLead, setOpenLead] = useState(false);

  // Load static procedure data based on slug
  const staticData = staticProcedures[slug] || staticProcedures._default;

  useEffect(() => {
    setLoading(true);
    setError("");
    API
      .get(`/treatments/${slug}`)
      .then((res) => setTreatment(res.data))
      .catch((err) => {
        console.error("Fetch treatment error:", err);
        const status = err?.response?.status;
        if (status === 404) {
          setError("No treatment found for this slug.");
        } else {
          setError(err?.response?.data?.error || err.message || "Failed to load treatment");
        }
        setTreatment(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Dynamic Meta Tags
  useEffect(() => {
    if (!treatment) return;

    document.title = treatment.metaTitle || treatment.title;

    if (treatment.metaDescription) {
      let desc = document.querySelector('meta[name="description"]');
      if (!desc) {
        desc = document.createElement("meta");
        desc.name = "description";
        document.head.appendChild(desc);
      }
      desc.content = treatment.metaDescription;
    }
  }, [treatment]);

  if (loading) return <div style={{ padding: 40 }}>Loading treatment...</div>;
  if (error) {
    // fallback: show static info if available
    return (
      <div style={{ padding: 60 }}>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>{staticData?.title || slug}</h1>
        <div style={{
          background: "#ffecec",
          border: "1px solid #f5c2c7",
          color: "#a94442",
          padding: 16,
          borderRadius: 10,
          maxWidth: 600,
          marginBottom: 30,
        }}>
          {error}
        </div>
        {staticData?.seoFallback && (
          <p style={{ maxWidth: 800, lineHeight: 1.6 }}>{staticData.seoFallback}</p>
        )}
        <p style={{ marginTop: 20 }}>
          <a href="/treatments" className="btn-secondary">Back to Treatments</a>
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 60 }}>

      {/* ---------------------- HERO ---------------------- */}
      <section>
        <h1 className="hero-title">{treatment.title}</h1>

        {treatment.heroImage && (
          <img
            src={treatment.heroImage}
            alt="hero"
            style={{
              width: "100%",
              maxHeight: 420,
              borderRadius: 18,
              marginTop: 20,
              objectFit: "cover",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          />
        )}

        <div className="hero-cta-group" style={{ marginTop: 20 }}>
          <button className="btn-primary" onClick={openModal}>Book Appointment</button>
          <a href="tel:+919999999999" className="btn-secondary">Call Clinic</a>
          <a href="https://wa.me/919999999999" className="btn-secondary">WhatsApp</a>
        </div>
      </section>

      {/* ---------------------- SEO COPY ---------------------- */}
      <section
        style={{
          marginTop: 30,
          padding: 26,
          borderRadius: 16,
          background: "rgba(250,246,237,0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 600 }}>About This Treatment</h2>
        <p style={{ marginTop: 10, lineHeight: 1.7 }}>{treatment.seoCopy}</p>
      </section>

      {/* ---------------------- PROCEDURE SECTION ---------------------- */}
      {staticData.procedureSteps?.length > 0 && (
        <section
          style={{
            marginTop: 30,
            padding: 26,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Procedure — What to Expect</h2>

          <ul style={{ marginTop: 14 }}>
            {staticData.procedureSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 14 }}>
                <strong style={{ color: "var(--sage-green)" }}>{step.title}</strong>
                <div style={{ marginTop: 4, color: "var(--text-secondary)" }}>{step.desc}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------------------- DURATION & VISITS ---------------------- */}
      <section
        style={{
          marginTop: 30,
          padding: 26,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Duration & Visits</h2>

        <p style={{ marginTop: 10 }}>
          <strong>Duration:</strong> {staticData.duration}
          <br />
          <strong>Visits:</strong> {staticData.visits}
        </p>
      </section>

      {/* ---------------------- PRICING ---------------------- */}
      {(treatment.regularPrice || treatment.memberPrice) && (
        <section
          style={{
            marginTop: 30,
            padding: 26,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Pricing</h2>

          {treatment.regularPrice && (
            <p style={{ marginTop: 10 }}>
              <strong>Regular Price:</strong> {treatment.regularPrice}
            </p>
          )}

          {treatment.memberPrice && (
            <p style={{ marginTop: 6, color: "var(--sage-green)" }}>
              <strong>Membership Price:</strong> {treatment.memberPrice}
            </p>
          )}
        </section>
      )}

      {/* ---------------------- BEFORE & AFTER GALLERY ---------------------- */}
      {treatment.gallery?.length > 0 && (
        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Before & After Gallery</h2>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {treatment.gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`case-${i}`}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 14,
                  objectFit: "cover",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------- FAQS ---------------------- */}
      {treatment.faqs?.length > 0 && (
        <section
          style={{
            marginTop: 30,
            padding: 26,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>FAQs</h2>

          <div style={{ marginTop: 14 }}>
            {treatment.faqs.map((f, i) => (
              <details key={i} style={{ marginBottom: 12, cursor: "pointer" }}>
                <summary style={{ fontSize: 17, fontWeight: 600 }}>{f.q}</summary>
                <p style={{ marginTop: 8, color: "var(--text-secondary)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------- CTA ---------------------- */}
      <div
        className="hero-cta-group"
        style={{ marginTop: 40, display: "flex", gap: 12 }}
      >
       <button className="btn-primary" onClick={() => setOpenLead(true)}>
              Book a Consultation
      </button>

        <a href="tel:+919999999999" className="btn-secondary">Call Clinic</a>
        <a href="https://wa.me/919999999999" className="btn-secondary">WhatsApp</a>
      </div>
      {/* ------------------ LEAD FORM POPUP ------------------ */}
{openLead && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: 30,
        borderRadius: 14,
        width: "90%",
        maxWidth: 420,
        position: "relative",
      }}
    >
      <button
        onClick={() => setOpenLead(false)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      <h2 style={{ marginBottom: 16 }}>Book a Consultation</h2>

      <LeadForm
        source={`Treatment Page - ${slug}`}
        onSuccess={() => setOpenLead(false)}
      />
    </div>
  </div>
)}

    </div>
  );
}





