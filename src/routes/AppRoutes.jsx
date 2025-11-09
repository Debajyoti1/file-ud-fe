import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import DownloadPage from "../pages/DownloadPage";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import UnprotectedRoute from "../components/UnprotectedRoute";

const router = createBrowserRouter([
  {
    element: <MainLayout />, // Layout route
    children: [
      {
        path: "/",
        element: (
          <UnprotectedRoute>
            <HomePage />
          </UnprotectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/download/:id",
        element: <DownloadPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
