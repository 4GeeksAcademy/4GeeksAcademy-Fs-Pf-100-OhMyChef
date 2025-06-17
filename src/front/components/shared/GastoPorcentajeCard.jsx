import React from "react";

export const GastoPorcentajeCard = ({ mes, ventas, gastos, porcentaje }) => {
  const color = porcentaje <= 33 ? "success" : porcentaje <= 36 ? "warning" : "danger";

  return (
    <div className="card border shadow-sm">
      <div className={`card-header bg-${color} text-white`}>Resumen de {mes}</div>
      <div className="card-body">
        <p><strong>Ventas:</strong> €{ventas}</p>
        <p><strong>Gastos:</strong> €{gastos}</p>
        <p><strong>Porcentaje:</strong> {porcentaje}%</p>
      </div>
    </div>
  );
};