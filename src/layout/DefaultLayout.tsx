import React, { ReactNode, useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);

        if (parsedUserData) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
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
              <div className="max-w-screen p-4 bg-base-200">{children}</div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultLayout;
