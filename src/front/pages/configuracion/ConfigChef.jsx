import React from "react";
import { DatosPersonales } from "./Datos/DatosPersonales.jsx";
import { CambiarContrasena } from "./Datos/CambiarContrasena.jsx";
import { MonedaPrincipal } from "./Datos/MonedaPrincipal.jsx";

const ConfigChef = () => {
  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <h1 className="dashboard-title mb-4">Configuración del Chef</h1>
      <DatosPersonales />
      <CambiarContrasena />
      <MonedaPrincipal />
    </div>
  );
};
export default ConfigChef;