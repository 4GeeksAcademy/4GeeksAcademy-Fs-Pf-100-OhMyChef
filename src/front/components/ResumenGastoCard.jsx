import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { GastoPorcentajeCard } from "../components/shared/GastoPorcentajeCard"; 
import encargadoServices from "../services/encargadoServices"; // ✅ CORREGIDO

export const ResumenGastoCard = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");

  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const ano = hoy.getFullYear();
  const nombreMes = hoy.toLocaleString("es", { month: "long", year: "numeric" });

  useEffect(() => {
    encargadoServices.resumenGastoMensual(mes, ano)
      .then(data => setResumen(data))
      .catch(() => setError("Error al obtener resumen"));
  }, []);

  return (
    <div className="container mt-4">
      <h4>Resumen actual del restaurante</h4>
      <div className="row mt-3 w-90 justify-content-start d-flex">
        <div className="p-3 ms-1 me-3 col-11 col-sm-11 col-lg-5 border rounded bg-white shadow-sm order-1">
          {error && <p className="text-danger">{error}</p>}

          {resumen ? (
            <GastoPorcentajeCard
              restauranteId={user.restaurante_id}
              mes={nombreMes}
              ventas={resumen.ventas}
              gastos={resumen.gastos}
              porcentaje={resumen.porcentaje}
            />
          ) : (
            !error && <p className="text-muted">Cargando resumen...</p>
          )}
        </div>
      </div>
    </div>
  );
};
