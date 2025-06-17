import React from "react";
import VentasResumen from "../../components/VentasResumen";
import AdminVentasCalendario from "../../components/AdminVentasCalendario";


export const AdminVentas = () => {
  return (
    <>
      <div className="dashboard-container">

        <h1 className="dashboard-title">Ventas</h1>
        <p class="dashboard-welcome mb-4">Introduce tus ventas</p>
        <div className="p-3 ms-0 me-3 col-11  col-sm-11 col-lg-5 border rounded bg-white shadow-sm order-1">
          <VentasResumen
            restauranteId="1231"
            mes="Mayo 2025"
            ventas={2500}
            porcentaje={27}

          />
        </div>



      </div>


    </>


  );
};
