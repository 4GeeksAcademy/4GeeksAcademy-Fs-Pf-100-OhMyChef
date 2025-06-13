
const proveedorServices = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

proveedorServices.getProveedores = async (restaurante_id) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/proveedores`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Error al obtener proveedores");
  const data = await resp.json();
  return data.filter(p => p.restaurante_id === restaurante_id);
};


proveedorServices.crearProveedor = async (formData) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/proveedores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData),
  });
  if (!resp.ok) throw new Error("Error al crear proveedor");
  return await resp.json();
};


proveedorServices.getProveedor = async (id) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/proveedores/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Error al obtener proveedor");
  return await resp.json();
};


proveedorServices.editarProveedor = async (id, formData) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/proveedores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData),
  });
  if (!resp.ok) throw new Error("Error al editar proveedor");
  return await resp.json();
};


proveedorServices.eliminarProveedor = async (id) => {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(`${backendUrl}/api/proveedores/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Error al eliminar proveedor");
  return await resp.json();
};

export default proveedorServices;