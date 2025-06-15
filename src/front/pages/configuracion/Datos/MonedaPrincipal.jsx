import React, { useState, useEffect } from "react";
export const MonedaPrincipal = () => {
  const restaurante_id = sessionStorage.getItem("restaurante_id");
  const [moneda, setMoneda] = useState(sessionStorage.getItem("restaurante_moneda") || "");
  useEffect(() => {
    const monedaGuardada = sessionStorage.getItem("restaurante_moneda");
    if (monedaGuardada) setMoneda(monedaGuardada);
  }, []);
  const handleChange = (e) => {
    setMoneda(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurantes/${restaurante_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ moneda }),
      });
      if (!resp.ok) throw new Error("Error al actualizar la moneda");
      const data = await resp.json();
      sessionStorage.setItem("restaurante_moneda", moneda);
      alert("Moneda actualizada correctamente");
    } catch (error) {
      console.error("Error al guardar la moneda:", error);
      alert("Hubo un problema al guardar la moneda");
    }
  };
  return (
    <div className="card col-sm-12 col-md-12 col-lg-10 me-4 col-xl-5 p-4 mb-4">
      <h4>Moneda principal</h4>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Selecciona tu moneda</label>
        <select className="form-select" value={moneda} onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="EUR">€ Euro</option>
          <option value="USD">$ Dólar</option>
          <option value="GBP">£ Libra</option>
        </select>
        <button type="submit" className="btn btn-primary mt-3">Guardar</button>
      </form>
    </div>
  );
};
