import React, { useState, useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const DatosPersonales = () => {
  const { store, dispatch } = useGlobalReducer();
  const user = store.user;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        nombre,
        email,
      };

      if (user.password) updateData.password = user.password;
      if (user.restaurante_id !== undefined) updateData.restaurante_id = user.restaurante_id;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Error actualizando datos");

      const data = await response.json();
      console.log(data);

      // Actualizar store si lo deseas con nueva info del usuario
      dispatch({ type: "get_user_info", payload: { ...user, nombre, email } });

      alert("Datos personales actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar datos personales:", error);
      alert("Error al actualizar los datos");
    }
  };


  return (
    <div className="card col-sm-12 col-md-12 col-lg-10 me-4 col-xl-5 p-4 mb-4">
      <h4>Datos personales</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
<<<<<<< HEAD
        <button type="submit" className="btn btn-success">
=======
        <button type="submit" className="btn bg-orange text-white">
>>>>>>> ce187c70b42819f43d9d0144d998fa2db81a6931
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

