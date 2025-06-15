import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import gastoServices from "../services/GastoServices";

export const GastoForm = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [gastos, setGastos] = useState([
    { proveedor_id: "", categoria: "", monto: "", nota: "" }
  ]);
  const [proveedores, setProveedores] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const nombreMes = new Date(fecha).toLocaleString("es", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (user?.restaurante_id) {

      gastoServices
        .getProveedores(user.restaurante_id)
        .then(setProveedores)
        .catch(() => setMensaje("Error al cargar proveedores"));
    }
  }, [user]);

  const handleChange = (index, e) => {

    const updatedGastos = [...gastos];
    updatedGastos[index][e.target.name] = e.target.value;
    setGastos(updatedGastos);
  };

  const handleAddRow = () => {

    setGastos([...gastos, { proveedor_id: "", categoria: "", monto: "", nota: "" }]);
  };

  const handleRemoveRow = (index) => {

    const updated = [...gastos];
    updated.splice(index, 1);
    setGastos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const incompletos = gastos.some(
      (g) => !g.proveedor_id || !g.categoria || !g.monto
    );
    if (incompletos) {
      setMensaje("Por favor completa todos los campos obligatorios");
      return;
    }

    const payload = gastos.map((g) => ({
      ...g,
      fecha,
      usuario_id: user.id,
      restaurante_id: user.restaurante_id,
    }));

    if (!window.confirm("¿Confirmas los datos introducidos?")) return;

    try {
      await gastoServices.registrarGasto(payload);
      setMensaje("Gastos registrados con éxito");
      setGastos([{ proveedor_id: "", categoria: "", monto: "", nota: "" }]);

      setTimeout(() => {
        navigate(`/${user.rol}/gastos`);
      }, 1500);
    } catch {
      setMensaje("Error al registrar gastos");
    }
  };

  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <h2>Registrar Gastos del día</h2>
      <h5 className="text-muted mb-3">Mes actual: {nombreMes.toUpperCase()}</h5>


      <div className="col-12 col-sm-12 col-md-9 col-lg-7 col-xl-7 col-xxl-6 mt-4">
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="form-control"
          />
        </div>

        <form onSubmit={handleSubmit}>
          {gastos.map((gasto, index) => (
            <div className="row align-items-end mb-3" key={index}>
              <div className="col-md-3">
                <label className="form-label">Proveedor</label>
                <select
                  className="form-select"
                  name="proveedor_id"
                  value={gasto.proveedor_id}
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  <option value="">Seleccione</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={gasto.categoria}
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="alimentos">Alimentos</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Monto (€)</label>
                <input
                  type="number"
                  className="form-control"
                  name="monto"
                  value={gasto.monto}
                  onChange={(e) => handleChange(index, e)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Nota</label>
                <input
                  type="text"
                  className="form-control"
                  name="nota"
                  value={gasto.nota}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              <div className="col-md-2 text-end">
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger mt-2"
                    onClick={() => handleRemoveRow(index)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={handleAddRow}
            >
              + Añadir otro gasto
            </button>
            <button type="submit" className="btn btn-primary">
              Registrar Gastos
            </button>
          </div>

          {mensaje && (
            <div
              className={`alert mt-3 ${mensaje.toLowerCase().includes("éxito")
                ? "alert-success"
                : "alert-danger"
                }`}
            >
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
