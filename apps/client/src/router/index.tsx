import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage.tsx";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import {
  LoginPage,
  PlacementPage,
  ProfilePage,
  AlumniListPage,
  AlumniProfilePage,
} from "@/pages/index.ts";
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
            element: <PlacementPage />,
          },
          {
            path: "interviews",
            element: <ComingSoon label="Interviews" />,
          },
          {
            path: "alumni",
            children: [
              {
                index: true,
                element: <AlumniListPage />,
              },
              {
                path: ":id",
                element: <AlumniProfilePage />,
              },
            ],
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
