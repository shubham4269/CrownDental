import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import ChangePassword from "./components/Changepassword";

import Dashboard from "./Pages/Admin/Dashboard";

import Home from "./Pages/Home";
import Doctors from "./Pages/Doctors";
import TreatmentsHub from "./Pages/Treatments/treatmentsHub";
import SingleTreatment from "./Pages/Treatments/SingleTreatment";
import PublicGallery from "./Pages/Gallery";

import TreatmentsList from "./Pages/Admin/TreatmentsList";
import TreatmentForm from "./Pages/Admin/TreatmentForm";
import Gallery from "./Pages/Admin/Gallery";
import Appointments from "./Pages/Admin/Appointments";
import AppointmentForm from "./Pages/AppointmentForm";
import Leads from "./Pages/Admin/Leads"; 
import Subscribers from "./Pages/Admin/Subscribers";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import FAQ from "./Pages/Faq";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfUse from "./Pages/TermsOfUse";
import RefundWarranty from "./Pages/RefundWarranty";




import Layout from "./components/Layout";
import { useAuth } from "./context/Authcontext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* -------- PUBLIC PAGES WITH LAYOUT -------- */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/treatments" element={<TreatmentsHub />} />
        <Route path="/treatments/:slug" element={<SingleTreatment />} />
        <Route path="/gallery" element={<PublicGallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/faqs" element={<FAQ />} />
        <Route path="/policies/privacy" element={<PrivacyPolicy />} />
        <Route path="/policies/terms" element={<TermsOfUse />} />
        <Route path="/policies/refund-warranty" element={<RefundWarranty />} />

      </Route>

      {/* -------- LOGIN WITHOUT LAYOUT -------- */}
      <Route path="/login" element={<Login />} />

      {/* -------- ADMIN DASHBOARD ROUTES -------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard /> {/* SIDEBAR + OUTLET */}
          </ProtectedRoute>
        }
      >
        <Route index element={<Leads />} /> 
        <Route path="treatments" element={<TreatmentsList />} />
        <Route path="treatments/add" element={<TreatmentForm />} />
        <Route path="treatments/edit/:id" element={<TreatmentForm />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="/dashboard/subscribers" element={<Subscribers />} />
      </Route>

      {/* -------- CHANGE PASSWORD OUTSIDE ADMIN -------- */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* -------- 404 FALLBACK -------- */}
      <Route path="*" element={<h2>404 Page Not Found</h2>} />
    </Routes>
  );
}

