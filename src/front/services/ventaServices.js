const ventaServices = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

ventaServices.registrarVenta = async (formData) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!resp.ok) {
    throw new Error("Error al registrar venta");
  }

  return await resp.json();
};

export default ventaServices;

ventaServices.getVentas = async () => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/ventas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    throw new Error("Error al obtener ventas");
  }

  return await resp.json();
};

ventaServices.eliminarVenta = async (id) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/ventas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Error al eliminar venta");
};

ventaServices.editarVenta = async (id, data) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/ventas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error("Error al actualizar venta");
};

