
import { useEffect, useState } from "react";
import GastosChef from "../../components/GastosChef";
import { QuickActionsEncargado } from "../../components/QuickActionsEncargado";
import "../../styles/EncargadoDashboard.css";
import encargadoServices from "../../services/encargadoServices";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MonedaSimbolo } from "../../services/MonedaSimbolo"; // ajusta la ruta si es necesario

export const EncargadoDashboard = () => {
  const simbolo = MonedaSimbolo();
  const [gastoDatos, setGastoDatos] = useState([]);
  const [resumenMensual, setResumenMensual] = useState(null);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fecha = new Date();
    const mes = fecha.getMonth() + 1;
    const ano = fecha.getFullYear();

    encargadoServices.resumenGastoDiario(mes, ano)
      .then((resumen) => {
        const data = resumen.map((item) => ({
          name: `${item.dia}`,
          porcentaje: item.porcentaje,
        }));
        setGastoDatos(data);
      })
      .catch((err) => console.error(err));

    encargadoServices.resumenGastoMensual(mes, ano)
      .then((resumen) => setResumenMensual(resumen))
      .catch((err) => console.error(err));

    encargadoServices.resumenVentasDiarias(mes, ano)
      .then((data) => setVentas(data))
      .catch((err) => console.error(err));
  }, []);

  const porcentaje = resumenMensual?.porcentaje || 0;
  const gasto = resumenMensual?.gastos || 0;

  const totalVentas = ventas.reduce((acc, item) => acc + item.monto, 0);
  const promedioDiario = ventas.length > 0 ? (totalVentas / ventas.length).toFixed(2) : 0;
  const proyeccionMensual = (promedioDiario * 30).toFixed(2);

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
      <h1 className="dashboard-title">Ventas</h1>
      <p class="dashboard-welcome mb-4">Configura tus ventas</p>
      <div className="card shadow-sm border rounded p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-3 d-flex flex-column gap-4 align-items-center">
            <div className="rounded shadow-sm p-3 text-center bg-warning-subtle w-100">
              <div className="icono-circular rounded-circle bg-white text-warning d-inline-flex align-items-center justify-content-center mb-2">
                💰
              </div>
              <h6 className="fw-bold text-warning">Ventas actuales</h6>
              <div className="fs-4 fw-bold text-dark">
                {totalVentas}{simbolo}
              </div>
            </div>

            <div className="rounded shadow-sm p-3 text-center bg-info-subtle w-100">
              <div className="icono-circular rounded-circle bg-white text-info d-inline-flex align-items-center justify-content-center mb-2">
                📈
              </div>
              <h6 className="fw-bold text-info">Promedio diario</h6>
              <div className="fs-5 text-info">{promedioDiario} €</div>
            </div>

            <div className="rounded shadow-sm p-3 text-center bg-success-subtle w-100">
              <div className="icono-circular rounded-circle bg-white text-warning d-inline-flex align-items-center justify-content-center mb-2">
                📊
              </div>
              <h6 className="fw-bold text-success">Proyección mensual</h6>
              <div className="fs-5 text-success">{proyeccionMensual} €</div>
            </div>
          </div>

          <div className="col-md-9">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ventas}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="monto" fill="#ffa94d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border rounded p-4 mb-4">
        <h5 className="mb-3 fw-bold">GASTOS</h5>
        <div className="row align-items-center">
          <div className="col-md-3 d-flex flex-column gap-4 align-items-center">
            <div className="rounded shadow-sm p-3 text-center bg-info-subtle w-100">
              <div className="icono-circular rounded-circle bg-white text-info d-inline-flex align-items-center justify-content-center mb-2">
                💸
              </div>
              <h6 className="fw-bold text-info">Gastos Actuales</h6>
              <div className="fs-4 fw-bold text-dark">
                {gasto} €
              </div>
            </div>

            <div className={`rounded shadow-sm p-3 text-center w-100 ${bgClass}`}>
              <div className={`icono-circular rounded-circle ${textClass} bg-white d-inline-flex align-items-center justify-content-center mb-2`}>
                {icono}
              </div>
              <h6 className={`fw-bold ${textClass}`}>% Gastos</h6>
              <div className={`fs-4 fw-bold ${textClass}`}>
                {porcentaje} %
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <h6 className="text-center mb-3">Gráfico Diario de Gastos</h6>
            <GastosChef
              datos={gastoDatos}
              ancho={800}
              alto={250}
              rol="encargado"
              xAxisProps={{ dataKey: "name", interval: 0 }}
              yAxisProps={{ domain: [0, 100], tickFormatter: v => `${v}%` }}
              tooltipProps={{ formatter: v => `${v}%` }}
              lineProps={{ dataKey: "porcentaje", stroke: "#82ca9d", strokeWidth: 2, dot: { r: 3 } }}
            />
          </div>
        </div>
      </div>

      <div className="card mt-4 shadow-sm border rounded p-4">
        <QuickActionsEncargado />
      </div>
    </div>
  );
};
