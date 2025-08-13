import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, user, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Close sidebar automatically on window resize below 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        style={{
          marginLeft: sidebarOpen && window.innerWidth >= 768 ? '240px' : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          // paddingTop: '110px', // to avoid topbar overlap, adjust as per Topbar height
        }}
      >
        <Topbar
          toggleSidebar={toggleSidebar}
          profilePhoto={user?.profilePhoto}
          user={user}
          role={role}
        />
        <main>{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;

// // components/DashboardLayout.jsx

// import React from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// const DashboardLayout = ({ children }) => {
//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       {/* Fixed Sidebar */}
//       <div style={{ width: "240px", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1000 }}>
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//         {/* Fixed Topbar */}
//         <div style={{ flexShrink: 0 }}>
//           <Topbar />
//         </div>

//         {/* Scrollable Content */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f4f7fb" }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
