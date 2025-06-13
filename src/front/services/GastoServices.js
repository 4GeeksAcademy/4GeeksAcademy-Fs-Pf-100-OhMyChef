const backendUrl = import.meta.env.VITE_BACKEND_URL;

const gastoServices = {};


gastoServices.getProveedores = async (restaurante_id) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/proveedores`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener proveedores");
  const data = await response.json();
  return data.filter((p) => p.restaurante_id === restaurante_id);
};


gastoServices.registrarGasto = async (gastoData) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/gastos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gastoData),
  });
  if (!response.ok) throw new Error("Error al registrar gasto");
  return await response.json();
};

gastoServices.registrarGastoMultiple = async (gastos) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/gastos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gastos),
  });
  if (!resp.ok) throw new Error("Error al registrar gastos múltiples");
  return await resp.json();
};


gastoServices.resumenMensual = async (mes, ano) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(
    `${backendUrl}/api/gastos/resumen-mensual?mes=${mes}&ano=${ano}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error("Error al obtener resumen");
  return await resp.json();
};


gastoServices.getGastos = async (restaurante_id, fecha) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(
    `${backendUrl}/api/gastos?restaurante_id=${restaurante_id}&fecha=${fecha}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error("Error al obtener gastos del día");
  return await resp.json(); 
};

export default gastoServices;
