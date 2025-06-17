import React, { useState } from "react";

export const Personalizacion = () => {
  const [tema, setTema] = useState("claro");

  const handleChange = (e) => setTema(e.target.value);

  return (
    <div className="card p-4 mb-4">
      <h4>Personalización</h4>
      <label className="form-label">Tema visual</label>
      <select className="form-select" value={tema} onChange={handleChange}>
        <option value="claro">Claro</option>
        <option value="oscuro">Oscuro</option>
      </select>
      <button className="btn bg-organge mt-3">Aplicar cambios</button>
    </div>
  );
};
