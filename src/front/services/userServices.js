const userServices = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

userServices.register = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
userServices.getUsuarios = async (token) => {
  const response = await fetch(`${backendUrl}/api/usuarios`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await new Promise((res) => setTimeout(res, 2000));
  if (!response.ok)
    throw new Error("No se pudo obtener la información del los usuarios");
  const data = await response.json();
  return data;
};

userServices.getUserinfo = async () => {
  const resp = await fetch(backendUrl + "/api/private", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  await new Promise((res) => setTimeout(res, 2000));
  if (!response.ok)
    throw new Error("No se pudo obtener la información del usuario");
  const data = await response.json();
  return data;
};
userServices.login = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    sessionStorage.setItem("token", data.access_token);
    sessionStorage.setItem("restaurante_id", data.user.restaurante_id); // :círculo_verde_grande: AÑADIDO
    sessionStorage.setItem("restaurante_moneda", data.user.restaurante_nombre); // :círculo_azul_grande: Opcional, si quieres también guardar la moneda
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default userServices;
