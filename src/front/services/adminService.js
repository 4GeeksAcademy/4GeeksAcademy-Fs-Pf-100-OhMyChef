const backendUrl = import.meta.env.VITE_BACKEND_URL;

const token = () => sessionStorage.getItem("token");

const adminService = {
  getRestaurantes: async () => {
    const res = await fetch(`${backendUrl}/api/restaurantes`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    return await res.json();
  },

  getResumenPorcentaje: async (restaurante_id, mes, ano) => {
    const res = await fetch(`${backendUrl}/admin/resumen-porcentaje?restaurante_id=${restaurante_id}&mes=${mes}&ano=${ano}`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error("Error en resumen");
    return await res.json();
  }
};

export default adminService;
