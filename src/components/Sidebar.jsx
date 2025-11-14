// src/components/Sidebar.jsx
import { useEffect } from "react";
import Icon from "./Icon";

export default function Sidebar() {
  return (
    <aside
      className="app-sidebar bg-body-secondary shadow"
      data-bs-theme="dark"
    >
      <div className="sidebar-brand">
        <a href="./index.html" className="brand-link">
          <img
            src="https://adminlte.io/themes/v4/assets/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image opacity-75 shadow"
          />
          <span className="brand-text fw-light">AdminLTE 4</span>
        </a>
      </div>
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
            id="navigation"
          >
            <li className="nav-item">
              <a href="./generate/theme.html" className="nav-link">
                <span className="sidebar-icon">
                  <Icon name={"dashboard"}></Icon>
                </span>
                <p>Campaigns</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="./generate/theme.html" className="nav-link">
                <i className="nav-icon bi bi-palette"></i>
                <p>Influencers</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="./generate/theme.html" className="nav-link">
                <i className="nav-icon bi bi-palette"></i>
                <p>Agreements</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="./generate/theme.html" className="nav-link">
                <i className="nav-icon bi bi-palette"></i>
                <p>Payments</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
