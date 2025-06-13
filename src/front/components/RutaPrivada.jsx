import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import userServices from "../services/userServices";
import { LoadingScreen } from "./LoadingScreen";

export const RutaPrivada = () => {
  const { store, dispatch } = useGlobalReducer();
  const [cargando, setCargando] = useState(true);
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  const path = location.pathname;

  const accesoPorRol = {
    "/admin": "admin",
    "/encargado": "encargado",
    "/ventas": "encargado",
    "/chef/gastos": "chef",
    "/chef": "chef"
  };

  const rutaBase = Object.keys(accesoPorRol).find((prefix) =>
    path.startsWith(prefix)
  );

  const rolPermitido = accesoPorRol[rutaBase] || null;

  useEffect(() => {
    console.log("Ruta actual:", path);
    console.log("Usuario cargado:", store.user);
    console.log("Rol del usuario:", store.user?.rol);
    console.log("Rol permitido para esta ruta:", rolPermitido);
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
  if (!token || !store.user) return <Navigate to="/" replace />;
  if (rolPermitido && store.user.rol !== rolPermitido) return <Navigate to="/" replace />;

  return <Outlet />;
};