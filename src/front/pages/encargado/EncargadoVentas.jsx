import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ventaServices from "../../services/ventaServices";
import { Link } from "react-router-dom";
import { MonedaSimbolo } from "../../services/MonedaSimbolo";

export const EncargadoVentas = () => {

  const simbolo = MonedaSimbolo();
  const { store } = useGlobalReducer();
  const user = store.user;

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarVentas = async () => {
    try {
      const data = await ventaServices.getVentas();
      const ventasRestaurante = data.filter(
        (venta) => venta.restaurante_id === user.restaurante_id
      );
      setVentas(ventasRestaurante);
    } catch (error) {
      setMensaje("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const total = ventas.reduce((acc, v) => acc + parseFloat(v.monto), 0);
  const diasUnicos = [...new Set(ventas.map((v) => v.fecha))];
  const promedio = diasUnicos.length > 0 ? total / diasUnicos.length : 0;

  const abrirModalEdicion = (venta) => {
    setVentaSeleccionada(venta);
    setNuevoMonto(venta.monto);
    const modal = new bootstrap.Modal(document.getElementById("editarModal"));
    modal.show();
  };

  const guardarEdicion = async () => {
    try {
      await ventaServices.editarVenta(ventaSeleccionada.id, {
        monto: parseFloat(nuevoMonto),
      });
      setMensaje("Venta actualizada con éxito");
      setTimeout(() => setMensaje(""), 2000);
      const modal = bootstrap.Modal.getInstance(document.getElementById("editarModal"));
      modal.hide();
      setVentaSeleccionada(null);
      cargarVentas();
    } catch (error) {
      setMensaje("Error al actualizar venta");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  const eliminarVenta = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
    try {
      await ventaServices.eliminarVenta(id);
      setMensaje("Venta eliminada correctamente");
      setTimeout(() => setMensaje(""), 2000);
      cargarVentas();
    } catch (error) {
      setMensaje("Error al eliminar venta");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ventas del restaurante</h2>
        <Link to="/encargado/registrar-venta" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>Registrar nueva venta
        </Link>
      </div>

      {/* Mensaje tipo GastoForm */}
      {mensaje && (
        <div
          className={`alert mt-2 ${mensaje.toLowerCase().includes("éxito") ||
            mensaje.toLowerCase().includes("eliminada")
            ? "alert-success"
            : "alert-danger"
            }`}
        >
          {mensaje}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <>
          {/* <p className="mt-3">
            <strong>Total:</strong> €{total.toFixed(2)}<br />
            <strong>Promedio diario:</strong> €{promedio.toFixed(2)}
          </p>
 */}


          <div className="rounded shadow-sm p-2 col-sm-12 col-md-7 col-lg-6 col-xl-4 col-xxl-3 text-center bg-info-subtle  d-flex flex-direction-row  ">
            <div className="icono-circular ms-2 me-4 rounded-circle bg-white text-info mt-1">
              📈</div>
            <div className="d-flex flex-column text-start">
              <h6 className="fw-bold text-info strong">Promedio diario: €{promedio.toFixed(2)}</h6>
              <div className="fs-5 text-info strong">Total: €{total.toFixed(2)}</div>
            </div>
          </div>







          <table className="table table-striped border mt-3">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto ({simbolo})</th>
                <th>Turno</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td>{v.fecha}</td>
                  <td>{v.monto}</td>
                  <td>{v.turno || "-"}</td>
                  <td>
                    <button
                      className="btn btn-outline-warning btn-sm me-1"
                      title="Editar"
                      onClick={() => abrirModalEdicion(v)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      title="Eliminar"
                      onClick={() => eliminarVenta(v.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<<<<<<< HEAD

=======
          <p className="mt-3">
            <strong>Total:</strong> {simbolo}{total.toFixed(2)}<br />
            <strong>Promedio diario:</strong> {simbolo}{promedio.toFixed(2)}
          </p>
>>>>>>> ce187c70b42819f43d9d0144d998fa2db81a6931
        </>
      )}

      <div className="modal fade" id="editarModal" tabIndex="-1" aria-labelledby="editarModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editarModalLabel">Editar Monto</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <label>Monto ({simbolo})</label>
              <input
                type="number"
                className="form-control"
                value={nuevoMonto}
                onChange={(e) => setNuevoMonto(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={guardarEdicion}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
