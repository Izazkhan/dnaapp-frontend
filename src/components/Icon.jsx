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

  uploadPlus: () => (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="17.3996" cy="16.5929" r="16.4816" fill="#E1F05B" />
      <path
        d="M17.3984 8.59375L17.3984 24.5937"
        stroke="#230344"
        stroke-width="3"
      />
      <path
        d="M25.3984 16.5938L9.39848 16.5938"
        stroke="#230344"
        stroke-width="3"
      />
    </svg>
  ),
  infoIcon: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"
        fill="#7E7E7E"
      />
    </svg>
  ),
};

const Icon = ({ name }) => {
  const SvgComponent = iconMap[name];

  if (!SvgComponent) {
    return <span style={{ display: "inline-block" }} />;
  }

  return <SvgComponent />;
};

export default Icon;
