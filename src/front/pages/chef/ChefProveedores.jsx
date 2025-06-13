import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import proveedorServices from "../../services/proveedorServices";
import { ProveedorForm } from "../../components/shared/ProveedorForm";

export const ChefProveedores  = () => {
  const { store } = useGlobalReducer();
  const restaurante_id = store.user.restaurante_id;

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const list = await proveedorServices.getProveedores(restaurante_id);
      setProveedores(list);
    } catch {
      setMensajeError("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este proveedor?")) return;
    try {
      await proveedorServices.eliminarProveedor(id);
      setMensajeExito("Proveedor eliminado correctamente");
      cargar();
      setTimeout(() => setMensajeExito(""), 3000);
    } catch {
      setMensajeError("Error al eliminar proveedor");
    }
  };

  const abrirModalCrear = () => {
    setModoEditar(false);
    setProveedorEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = async (id) => {
    try {
      const proveedor = await proveedorServices.getProveedor(id);
      setModoEditar(true);
      setProveedorEditando(proveedor);
      setMostrarModal(true);
    } catch {
      setMensajeError("No se pudo cargar el proveedor");
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProveedorEditando(null);
  };

  const handleSuccess = () => {
    cerrarModal();
    cargar();
    setMensajeExito("Proveedor guardado exitosamente");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Proveedores</h2>
        <button className="btn btn-success" onClick={abrirModalCrear}>
          + Nuevo Proveedor
        </button>
      </div>

      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}
      {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>
                  <button
                    className="btn btn-outline-warning btn-sm me-2"
                    onClick={() => abrirModalEditar(p.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <div className="modal d-block" style={{ backgroundColor: "#00000066" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <ProveedorForm
                proveedor={proveedorEditando}
                onSuccess={handleSuccess}
                onCancel={cerrarModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
