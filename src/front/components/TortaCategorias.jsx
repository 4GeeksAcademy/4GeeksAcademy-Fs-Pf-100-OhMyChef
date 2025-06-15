
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import chefServices from "../services/chefServices";

ChartJS.register(ArcElement, Tooltip, Legend);

export const TortaCategorias = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fecha = new Date();
    const mes = fecha.getMonth() + 1;
    const ano = fecha.getFullYear();

    chefServices.categoriasResumen(mes, ano)
      .then((resumen) => {
        const labels = resumen.map((item) => item.categoria);
        const valores = resumen.map((item) => item.total);

        const colores = [
          "#f87171", // alimentos (rojo suave)
          "#60a5fa", // bebidas (azul claro)
          "#facc15", // limpieza (amarillo)
          "#34d399", // otros (verde agua)
          "#a78bfa", // extra
          "#fb923c"  // extra
        ];

        setData({
          labels,
          datasets: [
            {
              label: "Gasto por Categoría (€)",
              data: valores,
              backgroundColor: colores.slice(0, labels.length),
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(() => {
        setData(null);
      });
  }, []);

  if (!data) return <p className="text-muted">Cargando gráfica de categorías...</p>;

  return (
    <div className="mt-4 card border shadow-sm bg-white p-4">
      <h5 className="card-title text-center mb-3">Distribución por Categoría</h5>
      <div style={{ maxWidth: "350px", height: "300px", margin: "0 auto" }}>
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 20,
                  padding: 15,
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
};
