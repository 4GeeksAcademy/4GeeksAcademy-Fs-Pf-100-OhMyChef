import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import userServices from "../services/userServices";

export const Layout = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  const role = user?.rol || "admin";

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && !store.user) {
      userServices.getUserinfo()
        .then(data => {
          dispatch({ type: "get_user_info", payload: data.user });
        })
        .catch(() => {
          sessionStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar role={role} />
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
