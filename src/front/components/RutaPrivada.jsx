import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import userServices from "../services/userServices";
import { LoadingScreen } from "./LoadingScreen";

export const RutaPrivada = () => {
  const { store, dispatch } = useGlobalReducer();
  const [cargando, setCargando] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token && !store.user) {
      userServices
        .getUserinfo()
        .then((data) => {
          dispatch({ type: "get_user_info", payload: data.user });
          setCargando(false);
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          setCargando(false);
        });
    } else {
      setCargando(false);
    }
  }, [token]);

  if (cargando) return <LoadingScreen />;
  if (!token || !store.user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
