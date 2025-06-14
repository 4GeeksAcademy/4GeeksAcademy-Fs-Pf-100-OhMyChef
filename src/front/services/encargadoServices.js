const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api";

const encargadoServices = {
  resumenGastoMensual: async (mes, ano) => {
    const token = sessionStorage.getItem("token");

    const res = await fetch(
      `${backendUrl}/gastos/porcentaje-mensual?mes=${mes}&ano=${ano}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Error al obtener resumen");
    return await res.json();
  },

  resumenVentasDiarias: async (mes, ano) => {
    const token = sessionStorage.getItem("token");

    const res = await fetch(
      `${backendUrl}/ventas/resumen-diario?mes=${mes}&ano=${ano}`,
      {
        headers: {
          Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok)
      throw new Error("No se pudo obtener el resumen diario de ventas");
    return await res.json();
  },

  resumenGastoDiario: async (mes, ano) => {
    const token = sessionStorage.getItem("token");

    const res = await fetch(
      `${backendUrl}/gastos/resumen-diario?mes=${mes}&ano=${ano}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok)
      throw new Error("No se pudo obtener el resumen diario de gastos");
    return await res.json();
  }
};

export default encargadoServices;
