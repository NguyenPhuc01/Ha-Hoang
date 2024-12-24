import React, { ReactNode, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="w-full h-screen">
      {location.pathname === "/login" || location.pathname === "/signup" ? (
        <div>{children}</div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div className="max-w-screen p-4 ">{children}</div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultLayout;
