const backendUrl = import.meta.env.VITE_BACKEND_URL;

const therestaurant = {};

therestaurant.crearRestaurante = async (restaurante) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/restaurantes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // si tu API requiere "Bearer"
    },
    body: JSON.stringify(restaurante),
  });

  if (!response.ok) {
    throw new Error("Error al registrar gasto");
  }

  return await response.json();
};

therestaurant.getRestaurantes = async (token) => {
  const response = await fetch(`${backendUrl}/api/restaurantes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await new Promise((res) => setTimeout(res, 1000));

  if (!response.ok)
    throw new Error("No se pudo obtener la información del los usuarios");
  const data = await response.json();
  return data;
};

therestaurant.eliminarRestaurante = async (id, token) => {
  try {
    console.log("ID que se va a eliminar:", id);
    console.log("Token:", token);

    const response = await fetch(`${backendUrl}/api/restaurantes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Código de respuesta HTTP:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta del servidor:", errorText);
      throw new Error("No se pudo eliminar el restaurante");
    }

    const data = response.status !== 204 ? await response.json() : null;
    return data;
  } catch (error) {
    console.error("Error al eliminar restaurante:", error.message);
    throw error;
  }
};

therestaurant.actualizarRestaurante = async (restaurante) => {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(
      `${backendUrl}/api/restaurantes/${restaurante.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restaurante), // ✅ Agregado el cuerpo con los datos actualizados
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo actualizar el restaurante");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar restaurante:", error);
    throw error;
  }
};

export default therestaurant;
