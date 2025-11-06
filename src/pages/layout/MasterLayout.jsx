import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";

export default function MasterLayout() {
  const { auth } = useAuth();

  const initRef = useRef(false);
  useEffect(() => {
    document.body.classList.add(
      "layout-fixed",
      "sidebar-expand-lg",
      "sidebar-open",
      "bg-body-tertiary"
    );

    // Only initialize once, even with StrictMode
    if (!initRef.current) {
      initializeAdminLTE();
      initRef.current = true;
    }

    // Cleanup function
    return () => {
      document.body.classList.remove(
        "layout-fixed",
        "sidebar-expand-lg",
        "sidebar-open",
        "bg-body-tertiary"
      );
    };
  }, []);

  if (!auth?.isReady) {
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

  return (
    <div className="app-wrapper">
      <Header />
      <Sidebar />
      <main className="app-main" id="main" tabIndex="-1">
        <Outlet />
      </main>
    </div>
  );
}

// Initialize all AdminLTE components
function initializeAdminLTE() {
  const DATA_KEY = "lte.push-menu";
  const EVENT_KEY = `.${DATA_KEY}`;
  const CLASS_NAME_SIDEBAR_OVERLAY = "sidebar-overlay";
  const SELECTOR_APP_SIDEBAR = ".app-sidebar";
  const SELECTOR_APP_WRAPPER = ".app-wrapper";
  const SELECTOR_SIDEBAR_TOGGLE = '[data-lte-toggle="sidebar"]';

  const Defaults = {
    sidebarBreakpoint: 992,
  };

  // Get PushMenu class from window.adminlte
  const PushMenu = window.adminlte?.PushMenu;

  if (!PushMenu) {
    console.error(
      "AdminLTE PushMenu not found. Make sure AdminLTE script is loaded."
    );
    return;
  }

  // Initialize PushMenu
  const sidebar = document?.querySelector(SELECTOR_APP_SIDEBAR);
  if (sidebar) {
    const data = new PushMenu(sidebar, Defaults);
    data.init();

    // Handle resize - use named function for easier cleanup
    const handleResize = () => {
      data.init();
    };
    window.addEventListener("resize", handleResize);
  }

  // Check if overlay already exists to avoid duplicates
  const existingOverlay = document.querySelector(
    `.${CLASS_NAME_SIDEBAR_OVERLAY}`
  );
  if (!existingOverlay) {
    const sidebarOverlay = document.createElement("div");
    sidebarOverlay.className = CLASS_NAME_SIDEBAR_OVERLAY;
    document.querySelector(SELECTOR_APP_WRAPPER)?.append(sidebarOverlay);

    let isTouchMoved = false;

    // Touch events for overlay
    sidebarOverlay.addEventListener(
      "touchstart",
      () => {
        isTouchMoved = false;
      },
      { passive: true }
    );

    sidebarOverlay.addEventListener(
      "touchmove",
      () => {
        isTouchMoved = true;
      },
      { passive: true }
    );

    sidebarOverlay.addEventListener(
      "touchend",
      (event) => {
        if (!isTouchMoved) {
          event.preventDefault();
          const target = event.currentTarget;
          const data = new PushMenu(target, Defaults);
          data.collapse();
        }
      },
      { passive: false }
    );

    // Click event for overlay
    sidebarOverlay.addEventListener("click", (event) => {
      event.preventDefault();
      const target = event.currentTarget;
      const data = new PushMenu(target, Defaults);
      data.collapse();
    });
  }

  // Setup sidebar toggle buttons - use event delegation to avoid duplicates
  const appWrapper = document.querySelector(SELECTOR_APP_WRAPPER);
  if (appWrapper) {
    // Remove any existing delegated listener by using a named handler
    const handleToggleClick = (event) => {
      let button = event.target.closest(SELECTOR_SIDEBAR_TOGGLE);
      if (button) {
        event.preventDefault();
        const data = new PushMenu(button, Defaults);
        data.toggle();
      }
    };

    // Use event delegation on app wrapper instead of individual buttons
    appWrapper.addEventListener("click", handleToggleClick, true);
  }

  // Initialize Treeview functionality
  initializeTreeview();
}

// Initialize Treeview for collapsible menu items
function initializeTreeview() {
  const Treeview = window.adminlte?.Treeview;

  if (!Treeview) {
    console.warn(
      "AdminLTE Treeview not found. Menu items will not be collapsible."
    );
    return;
  }

  const SELECTOR_NAV_ITEM = ".nav-item";
  const SELECTOR_DATA_TOGGLE = '[data-lte-toggle="treeview"]';
  const SELECTOR_NAV_LINK = ".nav-link";

  const Default = {
    accordion: true,
    animationSpeed: 300,
  };

  const buttons = document.querySelectorAll(SELECTOR_DATA_TOGGLE);
  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      console.log("Treeview toggle clicked");
      const target = event.target;
      const targetItem = target.closest(SELECTOR_NAV_ITEM);
      const targetLink = target.closest(SELECTOR_NAV_LINK);
      const lteToggleElement = event.currentTarget;

      if (
        target?.getAttribute("href") === "#" ||
        targetLink?.getAttribute("href") === "#"
      ) {
        event.preventDefault();
      }

      if (targetItem) {
        // Read data attributes
        const accordionAttr = lteToggleElement.dataset.accordion;
        const animationSpeedAttr = lteToggleElement.dataset.animationSpeed;

        // Build config from data attributes, fallback to Default
        const config = {
          accordion:
            accordionAttr === undefined
              ? Default.accordion
              : accordionAttr === "true",
          animationSpeed:
            animationSpeedAttr === undefined
              ? Default.animationSpeed
              : Number(animationSpeedAttr),
        };

        const data = new Treeview(targetItem, config);
        data.toggle();
      }
    });
  });
}
