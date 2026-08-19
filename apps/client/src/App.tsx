import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import { LoginPage } from "./features/auth/pages/LoginPage.tsx";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute.tsx";
import { ProfilePage } from "./features/profile/pages/ProfilePage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default dashboard content */}
          <Route
            index
            element={
              <div className="p-6">
                <p className="section-label mb-2">System</p>
                <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                <p className="mt-2 text-sm text-text-muted">Dashboard widgets coming soon.</p>
              </div>
            }
          />

          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Placeholder routes: build pages here as the project grows */}
          <Route path="classes" element={<ComingSoon label="Classes" />} />
          <Route path="placements" element={<ComingSoon label="Placements" />} />
          <Route path="interviews" element={<ComingSoon label="Interviews" />} />
          <Route path="alumni" element={<ComingSoon label="Alumni" />} />
        </Route>
      </Route>

      {/*Fallback*/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Placeholder page
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="p-6">
      <p className="section-label mb-2">Portal</p>
      <h1 className="text-2xl font-bold text-text">{label}</h1>
      <p className="mt-2 text-sm text-text-muted">Coming soon.</p>
    </div>
  );
}

export default App;
