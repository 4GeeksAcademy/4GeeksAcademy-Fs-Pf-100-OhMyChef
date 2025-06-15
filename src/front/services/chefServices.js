const API = import.meta.env.VITE_BACKEND_URL + "/api";

const chefServices = {
  resumenDiarioGastos: async (mes, ano) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${API}/gastos/resumen-diario?mes=${mes}&ano=${ano}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("No se pudo obtener el resumen diario");
    return await res.json();
  },

  resumenGastoMensual: async (mes, ano) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${API}/gastos/porcentaje-mensual?mes=${mes}&ano=${ano}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("No se pudo obtener el resumen mensual");
    return await res.json();
  },

  categoriasResumen: async (mes, ano) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${API}/gastos/categorias-resumen?mes=${mes}&ano=${ano}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("No se pudo obtener resumen por categoría");
    return await res.json();
  }
};

export default chefServices;
