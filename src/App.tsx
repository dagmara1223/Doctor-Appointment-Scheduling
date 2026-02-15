import { Routes, Route, Navigate } from "react-router-dom";
import DoctorPage from "./components/Doctor/DoctorsPage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import GuestHome from "./components/Guests/GuestHome";
import { useAuth } from "./Auth/AuthContext";

import PatientLayout from "./components/Patient/PatientLayout";
import PatientHome from "./components/Patient/PatientHome";
import PatientDoctorsList from "./components/Patient/PatientDoctorsList";
import PatientDoctorSchedule from "./components/Patient/PatientDoctorSchedule";
import PatientCart from "./components/Patient/PatientCart";

import AdminDashboard from "./components/Admin/AdminDashboard";

import DoctorHome from "./components/Doctor/DoctorHome";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        {/* strona glowna */}
        <Route
          path="/"
          element={
            !user ? (
              <GuestHome />
            ) : user.role === "PATIENT" ? (
              <Navigate to="/patient" />
            ) : user.role === "DOCTOR" ? (
              user.doctorStatus === "APPROVED" ? (
                <Navigate to="/doctor" />
              ) : (
                <Navigate to="/doctor/pending" />
              )
            ) : user.role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : null
          }
        />

        {/* pacjent */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientHome />} />
          <Route path="doctors" element={<PatientDoctorsList />} />
          <Route path="doctors/:doctorId" element={<PatientDoctorSchedule />} />
          <Route path="cart" element={<PatientCart />} />
        </Route>

        {/*doctor pending */}
        <Route
          path="/doctor/pending"
          element={
            <ProtectedRoute>
              <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>🕒 Konto lekarza oczekuje na weryfikację</h2>
                <p>
                  Twoje zgłoszenie zostało zapisane w systemie.
                  Administrator musi je zatwierdzić, zanim uzyskasz dostęp
                  do harmonogramu i pacjentów.
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/*doctor */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute>
              <DoctorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/manage"
          element={
            <ProtectedRoute>
              <DoctorPage />
            </ProtectedRoute>
          }
        />


        {/*admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
