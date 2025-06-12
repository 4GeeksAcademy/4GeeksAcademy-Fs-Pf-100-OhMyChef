import React from "react";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-4 mb-3">404 – Página no encontrada</h1>
      <p className="mb-4">La ruta que estás intentando acceder no existe o no tienes permiso.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
};
