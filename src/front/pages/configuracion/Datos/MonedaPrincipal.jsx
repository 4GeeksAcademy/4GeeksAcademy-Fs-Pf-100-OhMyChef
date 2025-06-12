import React from "react";

export const MonedaPrincipal = () => {
  return (
    <div className="card p-4 mb-4">
      <h4>Moneda principal</h4>
      <form>
        <label className="form-label">Selecciona tu moneda</label>
        <select className="form-select">
          <option value="EUR">€ Euro</option>
          <option value="USD">$ Dólar</option>
          <option value="GBP">£ Libra</option>
        </select>
        <button type="submit" className="btn btn-primary mt-3">Guardar</button>
      </form>
    </div>
  );
};
