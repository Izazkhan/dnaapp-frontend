// src/components/Icon.jsx
import React from "react";

const iconMap = {
  dashboard: () => (
    <svg viewBox="0 0 64 65" fill="none">
      <rect
        x="3.33299"
        y="4.13158"
        width="57.173"
        height="57.173"
        rx="8.9722"
        stroke="currentColor"
        strokeWidth="6.55325"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="12.9302"
        y="16.6514"
        width="37.6367"
        height="4.63798"
        rx="2.31899"
        fill="currentColor"
      />
      <rect
        x="12.9302"
        y="30.3008"
        width="37.6367"
        height="4.63798"
        rx="2.31899"
        fill="currentColor"
      />
      <rect
        x="12.9302"
        y="43.9502"
        width="37.6367"
        height="4.63798"
        rx="2.31899"
        fill="currentColor"
      />
    </svg>
  ),

  influencers: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),

  settings: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 0 0-.49-.42h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22l-1.92 3.32c-.13.22-.07.49.12.61l2.03 1.58c-.04.3-.06.61-.06.94 0 .33.02.64.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.13.22.35.31.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.42.49.42h3.84c.23 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.24.09.46 0 .59-.22l1.92-3.32c.13-.22.07-.49-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6 0-1.98 1.62-3.6 3.6-3.6 1.98 0 3.6 1.62 3.6 3.6 0 1.98-1.62 3.6-3.6 3.6z" />
    </svg>
  ),
};

const Icon = ({ name, size = 20, className = "", title, ...props }) => {
  const SvgComponent = iconMap[name];

  if (!SvgComponent) {
    return (
      <span style={{ width: size, height: size, display: "inline-block" }} />
    );
  }

  // Force size via style (SVG ignores width/height attributes)
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        lineHeight: 0,
      }}
      className={className}
      aria-hidden={!title}
      role={title ? "img" : "presentation"}
      {...props}
    >
      <SvgComponent />
      {title && <span className="visually-hidden">{title}</span>}
    </span>
  );
};

export default Icon;
