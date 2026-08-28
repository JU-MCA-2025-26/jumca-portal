import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage.tsx";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { LoginPage, ProfilePage } from "@/pages/index.ts";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute.tsx";
import ComingSoon from "@/components/ui/ComingSoon.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <div className="p-6">
                <p className="section-label mb-2">System</p>
                <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                <p className="mt-2 text-sm text-text-muted">Dashboard widgets coming soon.</p>
              </div>
            ),
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "classes",
            element: <ComingSoon label="Classes" />,
          },
          {
            path: "placements",
            element: <ComingSoon label="Placements" />,
          },
          {
            path: "interviews",
            element: <ComingSoon label="Interviews" />,
          },
          {
            path: "alumni",
            element: <ComingSoon label="Alumni" />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
