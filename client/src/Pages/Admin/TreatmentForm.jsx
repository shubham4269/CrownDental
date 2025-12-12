import React, { useEffect, useState } from "react";
import API from "../../services/api";
import slugify from "slugify";
import { useNavigate, useParams } from "react-router-dom";

function blankFaq() {
  return { q: "", a: "" };
}

export default function TreatmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const categoryOptions = [
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
  ];

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    metaTitle: "",
    metaDescription: "",
    seoCopy: "",
    benefits: [""],
    regularPrice: "",
    memberPrice: "",
    heroImage: "",
    gallery: [],
    faqs: [blankFaq()],
  });

  // LOAD EXISTING TREATMENT
  useEffect(() => {
    if (!id) return;
    API.get(`/treatments/id/${id}`).then((res) => {
      setForm((prev) => ({ ...prev, ...res.data }));
    });
  }, [id]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ----- BENEFITS HANDLERS -----
  const updateBenefit = (index, value) => {
    let b = [...form.benefits];
    b[index] = value;
    update("benefits", b);
  };

  const addBenefit = () => update("benefits", [...form.benefits, ""]);

  const removeBenefit = (index) =>
    update(
      "benefits",
      form.benefits.filter((_, i) => i !== index)
    );

  // ----- FAQ HANDLERS -----
  const updateFaqAt = (i, value) =>
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f, idx) => (i === idx ? value : f)),
    }));

  const removeFaqAt = (i) =>
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== i),
    }));

  // ----- IMAGE UPLOAD -----
  const uploadImage = async (e, target = "heroImage") => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const fd = new FormData();
    files.forEach((file) => fd.append("file", file));

    setLoading(true);

    try {
      const res = await API.post("/uploads/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (target === "heroImage" && res.data.url) {
        update("heroImage", res.data.url);
      }

      if (target === "gallery") {
        const urls = res.data.urls || [res.data.url];
        update("gallery", [...form.gallery, ...urls]);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index) =>
    update(
      "gallery",
      form.gallery.filter((_, i) => i !== index)
    );

  // ----- SAVE TREATMENT -----
  const submit = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!form.title.trim()) {
        setErrorMsg("Title is required");
        return;
      }
      if (!form.category.trim()) {
        setErrorMsg("Category is required");
        return;
      }

      let payload = { ...form };

      payload.slug =
        form.slug.trim() ||
        slugify(form.title, { lower: true, strict: true });

      if (id) {
        await API.put(`/treatments/${id}`, payload);
        alert("Updated");
      } else {
        await API.post("/treatments", payload);
        alert("Created");
      }

      navigate("/dashboard/treatments");
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        {id ? "Edit Treatment" : "Add Treatment"}
      </h1>

      {errorMsg && (
        <div
          style={{
            background: "#ffe8e8",
            padding: 14,
            borderRadius: 8,
            color: "crimson",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {errorMsg}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 20,
          background: "#faf7f2",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* TITLE */}
        <Field
          label="Treatment Title"
          required
          value={form.title}
          placeholder="Dental Implants"
          onChange={(v) => update("title", v)}
        />

        {/* CATEGORY */}
        <div>
          <label style={{ fontWeight: 600 }}>
            Category <span style={{ color: "crimson" }}>*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <option value="">Select Category</option>
            {categoryOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* BENEFITS */}
        <div>
          <label style={{ fontWeight: 600 }}>Key Benefits</label>

          {form.benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <input
                value={b}
                onChange={(e) => updateBenefit(i, e.target.value)}
                placeholder="Example: Natural-looking replacement"
                style={{ flex: 1, padding: 10, borderRadius: 8 }}
              />
              <button
                onClick={() => removeBenefit(i)}
                style={{
                  background: "crimson",
                  color: "white",
                  borderRadius: 6,
                  padding: "0 10px",
                }}
              >
                X
              </button>
            </div>
          ))}

          <button
            onClick={addBenefit}
            style={{ padding: "8px 14px", background: "#0a7b70", color: "white", borderRadius: 8 }}
          >
            + Add Benefit
          </button>
        </div>

        {/* META TITLE */}
        <Field
          label="Meta Title"
          value={form.metaTitle}
          onChange={(v) => update("metaTitle", v)}
        />

        {/* META DESCRIPTION */}
        <TextArea
          label="Meta Description"
          value={form.metaDescription}
          onChange={(v) => update("metaDescription", v)}
        />

        {/* SEO COPY */}
        <TextArea
          label="SEO Copy / Treatment Description"
          rows={6}
          value={form.seoCopy}
          onChange={(v) => update("seoCopy", v)}
        />

        {/* PRICING */}
        <Field
          label="Regular Price"
          value={form.regularPrice}
          onChange={(v) => update("regularPrice", v)}
        />

        <Field
          label="Membership Price"
          value={form.memberPrice}
          onChange={(v) => update("memberPrice", v)}
        />

        {/* HERO IMAGE */}
        <div>
          <label style={{ fontWeight: 600 }}>Hero Image</label>
          <input type="file" accept="image/*" onChange={(e) => uploadImage(e, "heroImage")} />

          {form.heroImage && (
            <img src={form.heroImage} alt="" style={{ height: 80, marginTop: 10, borderRadius: 8 }} />
          )}
        </div>

        {/* GALLERY IMAGES */}
        <div>
          <label style={{ fontWeight: 600 }}>Gallery (Before/After)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => uploadImage(e, "gallery")} />

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {form.gallery.map((g, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={g} alt="" style={{ height: 60, borderRadius: 6 }} />
                <button
                  onClick={() => removeGalleryImage(i)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "crimson",
                    color: "white",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <label style={{ fontWeight: 600 }}>FAQs</label>
          {form.faqs.map((f, i) => (
            <div key={i} style={{ padding: 10, background: "white", borderRadius: 10 }}>
              <Field
                value={f.q}
                placeholder="Question"
                onChange={(v) => updateFaqAt(i, { ...f, q: v })}
              />
              <TextArea
                value={f.a}
                placeholder="Answer"
                onChange={(v) => updateFaqAt(i, { ...f, a: v })}
              />

              <button
                onClick={() => removeFaqAt(i)}
                style={{
                  background: "crimson",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
              >
                Remove FAQ
              </button>
            </div>
          ))}

          <button
            onClick={() => update("faqs", [...form.faqs, blankFaq()])}
            style={{
              padding: "10px 14px",
              background: "#0a7b70",
              color: "white",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            + Add FAQ
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              padding: "12px 20px",
              background: loading ? "#aaa" : "#0a7b70",
              color: "white",
              borderRadius: 10,
              fontSize: 16,
            }}
          >
            {loading ? "Saving..." : id ? "Update Treatment" : "Create Treatment"}
          </button>

          <button
            onClick={() => navigate("/dashboard/treatments")}
            style={{ padding: "12px 20px", background: "#ddd", borderRadius: 10 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI Helper Components ---------- */

function Field({ label, value, placeholder, onChange, required }) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>
        {label} {required && <span style={{ color: "crimson" }}>*</span>}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 8 }}
      />
    </div>
  );
}

function TextArea({ label, value, placeholder, onChange, rows = 3 }) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 8 }}
      />
    </div>
  );
}

