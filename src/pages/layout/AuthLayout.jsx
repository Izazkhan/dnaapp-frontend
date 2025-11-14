import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout({ children }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    document.body?.classList?.add("bg-body-secondary", "app-loaded");
    setPageLoaded(true);
    return () => {
      document.body.classList.remove("bg-body-secondary", "app-loaded");
    };
  }, []);

  if (!pageLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading app...</span>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
