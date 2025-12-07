import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

import { FiChevronDown, FiCheck } from "react-icons/fi";

const categoryOptions = [
  "All",
  "Preventive",
  "Restorative",
  "Endodontics",
  "Implants",
  "Prosthetics",
  "Cosmetic",
  "Orthodontics",
  "Pediatric",
  "Periodontics",
  "Oral Surgery",
  "Memberships",
];

const concernOptions = [
  "Pain",
  "Cavities",
  "Gums",
  "Teeth Alignment",
  "Missing Teeth",
  "Smile Makeover",
  "Kids Care",
];

const durationOptions = ["Single Visit", "2–3 Visits", "Multi-Step Treatments"];

// ------------------ DROPDOWN REUSABLE ------------------
function Dropdown({ label, selected, setSelected, options, multiple = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          background: "white",
          border: "1.5px solid var(--sage-green)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          minWidth: 220,
          fontWeight: 600,
        }}
      >
        {multiple
          ? selected.length > 0
            ? `${selected.length} selected`
            : label
          : selected || label}

        <FiChevronDown />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            width: "100%",
            background: "white",
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 50,
          }}
        >
          {options.map((opt) => {
            const isActive = multiple
              ? selected.includes(opt)
              : selected === opt;

            return (
              <div
                key={opt}
                onClick={() => {
                  if (multiple) {
                    if (selected.includes(opt)) {
                      setSelected(selected.filter((v) => v !== opt));
                    } else {
                      setSelected([...selected, opt]);
                    }
                  } else {
                    setSelected(opt);
                    setOpen(false);
                  }
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isActive ? "var(--sage-green)" : "transparent",
                  color: isActive ? "white" : "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {multiple && (
                  <FiCheck
                    style={{ opacity: selected.includes(opt) ? 1 : 0.2 }}
                  />
                )}
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------ MAIN COMPONENT ------------------------
export default function TreatmentsHub() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");
  const [concerns, setConcerns] = useState([]);
  const [duration, setDuration] = useState("");

  // Fetch treatments
  useEffect(() => {
    API.get("/treatments")
      .then((res) => setTreatments(res.data || []))
      .catch((err) => {
        console.error(err);
        const msg = err?.response?.data?.error || err.message;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const clearFilters = () => {
    setCategory("All");
    setConcerns([]);
    setDuration("");
  };

  // Apply filters
  const filtered = useMemo(
    () =>
      treatments.filter((t) => {
        if (!t) return false;

        if (category !== "All" && t.category !== category) return false;

        if (concerns.length > 0) {
          const combined = `${t.short} ${t.seoCopy}`.toLowerCase();
          if (!concerns.some((c) => combined.includes(c.toLowerCase())))
            return false;
        }

        if (duration && !(t.duration || "").includes(duration)) return false;

        return true;
      }),
    [treatments, category, concerns, duration]
  );

  if (loading) return <div style={{ padding: 40 }}>Loading treatments...</div>;

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: "crimson" }}>Unable to load treatments</h2>
        <p style={{ color: "#555" }}>{error}</p>
      </div>
    );
  }

  // ------------------ UI ------------------
  return (
    <div style={{ background: "var(--soft-white)", minHeight: "100vh" }}>
      {/* SPACER BELOW FIXED NAVBAR (height ≈ header height) */}
      <div style={{ height: "96px" }} />

      {/* ---------------- HERO WITH BACKGROUND IMAGE ---------------- */}
      <section
        style={{
          padding: "80px 8% 100px",
          textAlign: "center",
          backgroundImage: 'url("/Images/treatment.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          position: "relative",
          borderRadius: "60px 60px 60px 60px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 3 }}>
          <h1 style={{ fontSize: 46, fontWeight: 700 }}>
            Specialist-Led Dental Care — Advanced, Gentle, Trusted
          </h1>
          <p
            style={{
              maxWidth: 820,
              margin: "20px auto 0",
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Explore preventive, restorative, cosmetic and surgical treatments
            delivered by specialists using modern dental technology.
          </p>
        </div>
      </section>

      {/* ---------------- FILTER BAR ---------------- */}
      <section style={{ padding: "30px 8%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Dropdown
            label="Category"
            selected={category}
            setSelected={setCategory}
            options={categoryOptions}
          />
          <Dropdown
            label="Concerns"
            selected={concerns}
            setSelected={setConcerns}
            options={concernOptions}
            multiple
          />
          <Dropdown
            label="Duration"
            selected={duration}
            setSelected={setDuration}
            options={durationOptions}
          />

          <button
            onClick={clearFilters}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* ---------------- TREATMENTS GRID ---------------- */}
      <section style={{ padding: "30px 8%" }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 24 }}>
          Treatments Library
        </h2>

        <div
          style={{
            display: "grid",
            gap: 26,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {filtered.map((t) => (
            <Link
              to={`/treatments/${t.slug}`}
              key={t.slug}
              style={{
                textDecoration: "none",
                color: "inherit",
                backdropFilter: "blur(14px)",
                background: "rgba(255,255,255,0.25)",
                borderRadius: 18,
                padding: 0,
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 8px 35px rgba(0,0,0,0.12)",
                overflow: "hidden",
                transition: "0.3s",
              }}
            >
              <div style={{ height: 180, overflow: "hidden" }}>
                <img
                  src={t.heroImage}
                  alt={t.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.3s",
                  }}
                />
              </div>

              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 25, marginBottom: 9 }}>{t.title}</h3>
                <p
                  style={{
                    fontSize: 17,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {(t.seoCopy || "").slice(0, 300)}...
                </p>

                <div
                  style={{
                    marginTop: 14,
                    color: "var(--sage-green)",
                    fontWeight: 700,
                  }}
                >
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

