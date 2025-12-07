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

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    seoCopy: "",
    regularPrice: "",
    memberPrice: "",
    heroImage: "",
    gallery: [],
    faqs: [blankFaq()],
  });

  // FETCH EXISTING DATA
  useEffect(() => {
    if (!id) return;
    API.get(`/treatments/id/${id}`).then((res) => {
      setForm({ ...form, ...res.data });
    });
    // eslint-disable-next-line
  }, [id]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

  // ⭐ REMOVE a gallery image
  const removeGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // ⭐ UPDATED uploadImage() — supports multiple uploads
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

      // Single hero upload
      if (target === "heroImage" && res.data.url) {
        update("heroImage", res.data.url);
      }

      // Multiple gallery uploads
      if (target === "gallery" && res.data.urls) {
        update("gallery", [...form.gallery, ...res.data.urls]);
      }

      // If backend returns only 1 image but target = gallery
      if (target === "gallery" && res.data.url) {
        update("gallery", [...form.gallery, res.data.url]);
      }

    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      let payload = { ...form };
      payload.slug =
        form.slug.trim() ||
        slugify(form.title || "", { lower: true, strict: true });

      // Client-side validation
      if (!form.title || !form.title.trim()) {
        setErrorMsg("Title is required.");
        return;
      }

      if (id) {
        await API.put(`/treatments/${id}`, payload);
        alert("Updated");
      } else {
        await API.post("/treatments", payload);
        alert("Created");
      }

      navigate("/dashboard/treatments");
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err.message;
      setErrorMsg(serverMsg);
      console.error("Save treatment error:", err);
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
            display: "grid",
            gap: 20,
            background: "#faf7f2",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          }}
        ></div>
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
        <div>
          <label style={{ fontWeight: 600 }}>
            Treatment Title (H1) <span style={{ color: "crimson" }}>*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Dental Implants"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border:
                !form.title?.trim() && errorMsg
                  ? "1px solid crimson"
                  : "1px solid #ccc",
            }}
          />
        </div>

        {/* META TITLE */}
        <div>
          <label style={{ fontWeight: 600 }}>Meta Title</label>
          <input
            value={form.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            placeholder="Dental Implants in Prayagraj — Crown Dental"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </div>

        {/* META DESCRIPTION */}
        <div>
          <label style={{ fontWeight: 600 }}>Meta Description</label>
          <textarea
            rows="3"
            value={form.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            placeholder="Permanent tooth replacement with world-class implants..."
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </div>

        {/* SEO COPY */}
        <div>
          <label style={{ fontWeight: 600 }}>SEO Treatment Description</label>
          <textarea
            rows="6"
            value={form.seoCopy}
            onChange={(e) => update("seoCopy", e.target.value)}
            placeholder="Full detailed treatment information..."
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </div>

        {/* PRICING */}
        <div>
          <label style={{ fontWeight: 600 }}>Regular Price</label>
          <input
            value={form.regularPrice}
            onChange={(e) => update("regularPrice", e.target.value)}
            placeholder="₹35,000"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Membership Price</label>
          <input
            value={form.memberPrice}
            onChange={(e) => update("memberPrice", e.target.value)}
            placeholder="₹29,999"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </div>

        {/* HERO IMAGE */}
        <div>
          <label style={{ fontWeight: 600 }}>Hero Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e, "heroImage")}
          />
          {form.heroImage && (
            <img
              src={form.heroImage}
              alt=""
              style={{ height: 80, borderRadius: 10, marginTop: 10 }}
            />
          )}
        </div>

        {/* GALLERY */}
        <div>
          <label style={{ fontWeight: 600 }}>Gallery (Before/After)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => uploadImage(e, "gallery")}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {form.gallery.map((g, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={g}
                  alt="case"
                  style={{ height: 60, borderRadius: 6 }}
                />

                {/* Delete button */}
                <button
                  onClick={() => removeGalleryImage(i)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "crimson",
                    color: "white",
                    borderRadius: "50%",
                    border: "none",
                    width: 22,
                    height: 22,
                    cursor: "pointer",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQS */}
        <div>
          <label style={{ fontWeight: 600 }}>FAQs</label>
          {form.faqs.map((f, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <input
                value={f.q}
                placeholder="Question"
                onChange={(e) =>
                  updateFaqAt(i, { ...f, q: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              />
              <textarea
                rows="2"
                value={f.a}
                placeholder="Answer"
                onChange={(e) =>
                  updateFaqAt(i, { ...f, a: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                }}
              />
              <button
                onClick={() => removeFaqAt(i)}
                style={{
                  marginTop: 6,
                  background: "crimson",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 6,
                }}
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                faqs: [...prev.faqs, blankFaq()],
              }))
            }
            style={{
              padding: "10px 14px",
              background: "#0a7b70",
              color: "white",
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            + Add FAQ
          </button>
        </div>

        {/* SUBMIT BUTTONS */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={submit}
            disabled={loading || !form.title?.trim()}
            style={{
              padding: "12px 20px",
              background:
                loading || !form.title?.trim() ? "#9dbab7" : "#0a7b70",
              color: "white",
              borderRadius: 10,
              fontSize: 16,
              cursor:
                loading || !form.title?.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Saving..." : id ? "Update Treatment" : "Create Treatment"}
          </button>

          <button
            onClick={() => navigate("/dashboard/treatments")}
            style={{
              padding: "12px 20px",
              background: "#ddd",
              borderRadius: 10,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
