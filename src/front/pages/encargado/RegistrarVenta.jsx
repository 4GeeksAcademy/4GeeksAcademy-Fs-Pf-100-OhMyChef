import { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ventaServices from "../../services/ventaServices";
import { useNavigate } from "react-router-dom";

export const RegistrarVenta = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    monto: "",
    turno: "mañana",
  });
  const [estado, setEstado] = useState({ loading: false, mensaje: "", error: false });

  const nombreMes = new Date(form.fecha).toLocaleString("es", { month: "long", year: "numeric" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ loading: true, mensaje: "", error: false });

    try {
      const data = {
        ...form,
        restaurante_id: store.user.restaurante_id,
      };
      await ventaServices.registrarVenta(data);
      setEstado({ loading: false, mensaje: "Venta registrada con éxito", error: false });
      setTimeout(() => {
        navigate("/encargado/ventas");
      }, 1500);
    } catch (error) {
      setEstado({ loading: false, mensaje: "Error al registrar la venta", error: true });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Venta</h2>
      <h5 className="text-muted mb-3">Mes actual: {nombreMes.toUpperCase()}</h5>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-3">
        {/* Fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        {/* Monto */}
        <div className="mb-3">
          <label className="form-label">Monto (€)</label>
          <input
            type="number"
            name="monto"
            className="form-control"
            value={form.monto}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Turno */}
        <div className="mb-3">
          <label className="form-label">Turno</label>
          <select name="turno" className="form-select" value={form.turno} onChange={handleChange}>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success" disabled={estado.loading}>
          {estado.loading ? "Guardando..." : "Registrar Venta"}
        </button>

        {estado.mensaje && (
          <div className={`alert mt-3 ${estado.error ? "alert-danger" : "alert-success"}`}>
            {estado.mensaje}
          </div>
        )}
      </form>
    </div>
  );
};
