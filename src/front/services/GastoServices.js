const backendUrl = import.meta.env.VITE_BACKEND_URL;

const gastoServices = {};

gastoServices.getProveedores = async (restaurante_id) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/proveedores`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener proveedores");
  }

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

  if (!response.ok) {
    throw new Error("Error al registrar gasto");
  }

  return await response.json();
};

registrarGastoMultiple: async (gastos) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendUrl + "/api/gastos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(gastos)
  });
  if (!resp.ok) throw Error("Error al registrar gastos múltiples");
  return await resp.json();
}

export default gastoServices;
