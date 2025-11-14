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
import CreateCampaign from "./pages/campaigns/CreateCampaign";
import { AdCampaignProvider } from "./context/AdCampaignProvider";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<ResetPassword />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MasterLayout />}>
          <Route path="/adcampaigns" element={<CampaignList />} />

          <Route
            path="/adcampaign/create"
            element={
              <AdCampaignProvider>
                <CreateCampaign />
              </AdCampaignProvider>
            }
          />
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}
