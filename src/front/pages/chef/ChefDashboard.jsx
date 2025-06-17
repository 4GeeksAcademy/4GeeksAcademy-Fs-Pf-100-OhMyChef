
import { useEffect, useState } from "react";
import GastosChef from "../../components/GastosChef";
import { TortaCategorias } from "../../components/TortaCategorias";
import chefServices from "../../services/chefServices";
import { QuickActionsChef } from "../../components/QuickActionsChef";

export const ChefDashboard = () => {
  const [datos, SetDatos] = useState([]);
  const [resumenMensual, setResumenMensual] = useState(null);

  useEffect(() => {
    const fecha = new Date();
    const mes = fecha.getMonth() + 1;
    const ano = fecha.getFullYear();

    chefServices.resumenDiarioGastos(mes, ano)
      .then((resumen) => {
        const data = resumen.map((item) => ({
          name: `${item.dia}`,
          porcentaje: item.porcentaje,
        }));
        SetDatos(data);
      })
      .catch((err) => console.error(err));

    chefServices.resumenGastoMensual(mes, ano)
      .then((resumen) => setResumenMensual(resumen))
      .catch((err) => console.error(err));
  }, []);

  const porcentaje = resumenMensual?.porcentaje || 0;
  const gasto = resumenMensual?.gastos || 0;


  let bgClass = "bg-success-subtle";
  let textClass = "text-success";
  let icono = "✅";

  if (porcentaje > 36) {
    bgClass = "bg-danger-subtle";
    textClass = "text-danger";
    icono = "🚨";
  } else if (porcentaje > 33) {
    bgClass = "bg-warning-subtle";
    textClass = "text-warning";
    icono = "⚠️";
  }

  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <h1 className="dashboard-title">Graficas en Porcentajes</h1>
      <p class="dashboard-welcome mb-4">Graficas de gastos</p>
      <div className="row justify-content-start">
        <div className="col-lg-11">
          <div className="card shadow-sm border rounded p-4">
            <div className="row align-items-center">
              <div className="col-md-3 d-flex flex-column gap-4 w- align-items-center">


                <div className="rounded shadow-sm p-3 text-center bg-info-subtle w-80">
                  <div className="rounded-circle bg-white text-info d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
                    💸
                  </div>
                  <h6 className="fw-bold text-info">Gastos Actuales</h6>
                  <div className="fs-4 fw-bold text-dark">
                    {gasto} €
                  </div>
                </div>


                <div className={`rounded shadow-sm p-3 text-center w-80 ${bgClass}`}>
                  <div className={`rounded-circle ${textClass} bg-white d-inline-flex align-items-center justify-content-center mb-2`}
                    style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
                    {icono}
                  </div>
                  <h6 className={`fw-bold ${textClass}`}>Porcentaje Gastos</h6>
                  <div className={`fs-4 fw-bold ${textClass}`}>
                    {porcentaje} %
                  </div>
                </div>

              </div>

              <div className="col-md-9 w-90">
                <h5 className="text-center mb-3">Gráfica de Gastos Diario</h5>
                <GastosChef
                  datos={datos}
                  ancho={800}
                  alto={300}
                  rol="chef"
                  xAxisProps={{ dataKey: "name", interval: 0 }}
                  yAxisProps={{ domain: [0, 100], tickFormatter: (v) => `${v}%` }}
                  tooltipProps={{ formatter: (v) => `${v}%` }}
                  lineProps={{ dataKey: "porcentaje", stroke: "#82ca9d", strokeWidth: 2, dot: { r: 3 } }}
                />
              </div>
            </div>
          </div>

          <div className="card mt-4 shadow-sm border rounded p-4">
            <TortaCategorias />
          </div>

          <div className="card mt-4 shadow-sm border rounded p-4">
            <QuickActionsChef />
          </div>
        </div>
      </div>
    </div>
  );
};
