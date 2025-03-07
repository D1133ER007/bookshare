import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";

export const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}; 