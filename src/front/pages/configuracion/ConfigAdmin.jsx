import React from "react";
import { DatosPersonales } from "./Datos/DatosPersonales.jsx";
import { CambiarContrasena } from "./Datos/CambiarContrasena.jsx";
import { MonedaPrincipal } from "./Datos/MonedaPrincipal.jsx";
import { Personalizacion } from "./Datos/Personalizacion.jsx";
import { AjustesAvanzados } from "./Datos/AjustesAvanzados.jsx";

export const ConfigAdmin = () => {
  return (
    <div className="container mt-4">
      <h2>Configuración del Administrador</h2>
      <hr />
      <DatosPersonales />
      <hr />
      <CambiarContrasena />
      <hr />
      <MonedaPrincipal />
      <hr />
      <Personalizacion />
      <hr />
      <AjustesAvanzados />
    </div>
  );
};
