import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CampaignList from "./pages/CampaignList";
import MasterLayout from "./pages/layout/MasterLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import NotFound from "./pages/NotFound";
import AuthLayout from "./pages/layout/AuthLayout";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import Profile from "./pages/profile/Profile";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/password-reset"
        element={
          <GuestRoute>
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route path="/" element={<MasterLayout />}>
        <Route
          path="/adcampaigns"
          element={
            <ProtectedRoute>
              <CampaignList />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}
