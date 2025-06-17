import React from "react";
import { DatosPersonales } from "./Datos/DatosPersonales.jsx";
import { CambiarContrasena } from "./Datos/CambiarContrasena.jsx";
import { MonedaPrincipal } from "./Datos/MonedaPrincipal.jsx";


export const ConfigAdmin = () => {
  return (
    <div className="dashboard-container ps-2 row py-3 pt-4 ">
      <h1 className="dashboard-title">Configuración del Administrador</h1>
      <p class="dashboard-welcome mb-4">Configura tu usuario</p>
      <DatosPersonales />

      <CambiarContrasena />

      <MonedaPrincipal />
    </div>
  );
};
