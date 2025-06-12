import { useState } from "react";

export const GastosProveedores = ({ proveedores }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm text-nowrap">
        <thead>
          <tr>
            <th rowSpan="2">Nombre</th>
            <th rowSpan="2">Gasto acumulado</th>
            <th colSpan="5" className="text-center">Semana del mes</th>
          </tr>
          <tr>
            <th>Semana 1</th>
            <th>Semana 2</th>
            <th>Semana 3</th>
            <th>Semana 4</th>
            <th>Semana 5</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={index}>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.gasto}$</td>
              {[...Array(5)].map((_, i) => (
                <td key={i}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};