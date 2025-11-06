import React, { useEffect } from "react";

export default function AuthLayout({ children }) {
  useEffect(() => {
    document.body?.classList?.add(
      "bg-body-secondary",
      "app-loaded"
    );
    return () => {
      document.body.classList.remove(
        "bg-body-secondary",
        "app-loaded"
      );
    };
  }, []);
  return children;
}
