import { Link } from "react-router-dom";

import GastosChef from "../../components/GastosChef";
import { GastosProveedores } from "../../components/GastosProveedores";
import { useState } from "react";


// datos para chef-gastos
export const ChefDashboard = () => {
  const data = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1}`,
    porcentaje: Math.floor(Math.random() * 101), // de 0 a 100
  }));
  const [datos, SetDatos] = useState(data)



  // datos para chef-proveedores
  const proveedoresget = [
    { nombre: 'proveedor 1', gasto: 5421 },
    { nombre: 'proveedor 2', gasto: 58743 },
    { nombre: 'proveedor 3', gasto: 89644 },
    { nombre: 'proveedor 4', gasto: 2145 },
    { nombre: 'proveedor 5', gasto: 9874 },
    { nombre: 'proveedor 6', gasto: 5213 },
    { nombre: 'proveedor 7', gasto: 95451 },
    { nombre: 'proveedor 8', gasto: 3562 },
    { nombre: 'proveedor 9', gasto: 9874 },
  ];
  const [proveedores, SetProveedores] = useState(proveedoresget)



  return (
    <>
      <div className="row ltr-scroll">
        <div className="graficoVentas col-sm-12 col-md-12 col-lg-11 col-xl-11 col-xxl-10 d-flex border pt-4 pb-4 mt-2 flex-sm-column flex-md-row">

          <div className="col-sm-12 justify-content-sm-around justify-content-md-start col-md-2 col-lg-2 gastos d-flex flex-sm-row flex-md-column  order-sm-2 order-md-1 ps-sm-0 ps-md-2 mt-sm-5 mb-sm-5 mt-md-0 mb-md-0 fs-5">
            <span className="d-flex flex-column fs-6 mt-sm-0">
              <span className="color-green fs-4">Gastos actuales</span>
              <span className="mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>

            <span className="d-flex flex-column fs-6 mt-sm-0 mt-lg-4">
              <span className="color-blue">Porcentaje de gastos</span>
              <span className="caja-azul mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>


          </div>
          <div className="col-sm-11 col-md-10 col-xxl-9  ms-md-4 ms-lg-0 order-sm-1 order-md-2  ">
            <h5 className=" titulo pt-1 ms-sm-0 ms-md-4 ms-4">Gráfica de Ventas </h5>
            <GastosChef
              datos={datos}
              ancho={800}
              alto={300}
              rol="chef"
              margen={{ top: 20, right: 30, left: 20, bottom: 5 }}
              xAxisProps={{ dataKey: "name", interval: 0 }}
              yAxisProps={{ domain: [0, 100], tickFormatter: (v) => `${v}%` }}
              tooltipProps={{ formatter: (v) => `${v}%` }}
              lineProps={{ dataKey: "porcentaje", stroke: "#82ca9d", strokeWidth: 2, dot: { r: 3 } }}
            />
            
          </div>

        </div>
      </div>

      <div className="row ltr-scroll">
        <div className="graficoGastos col-sm-12 col-md-12 col-lg-11 col-xl-11 col-xxl-10 d-flex border pt-4 pb-4 mt-2 flex-sm-column flex-md-row">

          <div className="col-sm-12 justify-content-sm-around justify-content-md-start col-md-2 col-lg-2 gastos d-flex flex-sm-row flex-md-column  order-sm-2 order-md-1 ps-sm-0 ps-md-2 mt-sm-5 mb-sm-5 mt-md-0 mb-md-0 fs-5">
            <span className="d-flex flex-column fs-6 mt-sm-0 ">
              <span className="color-green fs-4">Gastos Proveedores</span>
              <span className="mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>

            <span className="d-flex flex-column fs-6 mt-sm-0 mt-lg-4">
              <span className="color-blue">Porcentaje de gastos</span>
              <span className="caja-azul mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>


          </div>
          <div className="col-sm-11 col-md-9 ms-md-5 ms-lg-5 ms-2 order-sm-1 order-md-2 ">
            <h5 className=" titulo pb-4 ms-sm-0 ms-md-0 ms-4 pt-2">Resumen de Proveedores</h5>
            <GastosProveedores proveedores={proveedores} />
          </div>

        </div>
      </div>
    </>
  );
};
