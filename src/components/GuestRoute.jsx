// components/GuestRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute({ children }) {
  const { auth } = useAuth();

  // If logged in → redirect
  if (auth?.isAuthenticated) {
    return <Navigate to={"/adcampaigns"} replace />;
  }
  // If not → show page
  return children;
}
