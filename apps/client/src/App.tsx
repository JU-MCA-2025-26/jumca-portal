import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Layout shell only — nested pages plug into the Outlet above */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route
          index
          element={<p className="text-sm text-text-muted">Dashboard content goes here.</p>}
        />
      </Route>
    </Routes>
  );
}

export default App;
