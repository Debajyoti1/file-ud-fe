import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import UnprotectedRoute from "../components/UnprotectedRoute";
import FullScreenLoader from "../components/FullScreenLoader";

const HomePage = lazy(() => import("../pages/HomePage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const DownloadPage = lazy(() => import("../pages/DownloadPage"));
const NotFound = lazy(() => import("../pages/NotFound"));


const router = createBrowserRouter([
  {
    element: <MainLayout />,
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
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
