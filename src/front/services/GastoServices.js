const backendUrl = import.meta.env.VITE_BACKEND_URL;

const gastoServices = {};


gastoServices.getProveedores = async (restaurante_id) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/proveedores?restaurante_id=${restaurante_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener proveedores");
  return await response.json();
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

gastoServices.registrarGastoMultiple = async (data) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/gastos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error("Error al registrar gastos múltiples");
  return await resp.json();
};

gastoServices.resumenMensual = async (mes, ano, restaurante_id) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(
    `${backendUrl}/api/gastos/resumen-mensual?mes=${mes}&ano=${ano}&restaurante_id=${restaurante_id}`,
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
