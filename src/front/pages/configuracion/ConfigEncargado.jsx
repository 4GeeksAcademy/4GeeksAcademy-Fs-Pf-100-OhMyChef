import React from "react";
import { DatosPersonales } from "./Datos/DatosPersonales.jsx";
import { CambiarContrasena } from "./Datos/CambiarContrasena.jsx";
import { MonedaPrincipal } from "./Datos/MonedaPrincipal.jsx";

const ConfigEncargado = () => {
  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <h2 className="dashboard-title mb-4">Configuración del Encargado</h2>
      <DatosPersonales />
      <CambiarContrasena />
      <MonedaPrincipal />
    </div>
  );
};
export default ConfigEncargado;