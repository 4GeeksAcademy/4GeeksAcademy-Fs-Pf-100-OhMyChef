// components/shared/ProveedorForm.jsx
import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import proveedorServices from "../../services/proveedorServices";

export const ProveedorForm = ({ proveedor = null, onSuccess, onCancel }) => {
  const { store } = useGlobalReducer();
  const restaurante_id = store.user?.restaurante_id;

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    direccion: "",
    telefono: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (proveedor) {
      setForm({
        nombre: proveedor.nombre || "",
        categoria: proveedor.categoria || "",
        direccion: proveedor.direccion || "",
        telefono: proveedor.telefono || ""
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = { ...form, restaurante_id };
      if (proveedor) {
        await proveedorServices.editarProveedor(proveedor.id, payload);
      } else {
        await proveedorServices.crearProveedor(payload);
      }

      setSuccessMsg("Proveedor guardado exitosamente");
      setForm({ nombre: "", categoria: "", direccion: "", telefono: "" });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError("Ocurrió un error al guardar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>{proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="nombre"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          name="categoria"
          className="form-select"
          value={form.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione</option>
          <option value="alimentos">Alimentos</option>
          <option value="bebidas">Bebidas</option>
          <option value="limpieza">Limpieza</option>
          <option value="otros">Otros</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <input
          type="text"
          name="direccion"
          className="form-control"
          value={form.direccion}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="text"
          name="telefono"
          className="form-control"
          value={form.telefono}
          onChange={handleChange}
        />
      </div>
      <div className="d-flex justify-content-end">
        {onCancel && (
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};
