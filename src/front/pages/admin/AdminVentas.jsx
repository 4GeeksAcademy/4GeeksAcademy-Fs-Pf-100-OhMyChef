import React from "react";
import VentasResumen from "../../components/VentasResumen";
import AdminVentasCalendario from "../../components/AdminVentasCalendario";


export const AdminVentas = () => {
  return (
    <>
      <div className="row mt-3 w-90 justify-content-start d-flex">

        <div className="p-3 ms-1 me-3 col-11 col-sm-11 col-lg-5 mt-4 mt-sm-4 mt-lg-0 border rounded bg-white shadow-sm order-2">
          <AdminVentasCalendario
            buttons={["Gastos por fechas", "Gastos por Proveedor"]}
            fromDate="2023-01-01"
            toDate="2023-01-01"
            selectLabel="Vista por semana"
            selectOptions={["Last 7 days", "Last 14 days", "Last 30 days"]}
            onFilterChange={(field, value) => {
              console.log("Changed:", field, value);
            }}
          />
        </div>
        <div className="p-3 ms-1 me-3 col-11  col-sm-11 col-lg-5 border rounded bg-white shadow-sm order-1">
          <VentasResumen
            restauranteId="1231"
            mes="Mayo 2025"
            ventas={2500}
            porcentaje={27}

          />
        </div>



      </div>

      <div className="row mt-3 w-90 justify-content-start d-flex">asdfa</div>
    </>


  );
};
