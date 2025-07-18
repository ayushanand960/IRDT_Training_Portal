// components/DashboardLayout.jsx

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Fixed Sidebar */}
      <div style={{ width: "240px", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1000 }}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {/* Fixed Topbar */}
        <div style={{ flexShrink: 0 }}>
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f4f7fb" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
