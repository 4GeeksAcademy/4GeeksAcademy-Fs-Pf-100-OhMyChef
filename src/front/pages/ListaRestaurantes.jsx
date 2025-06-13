import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import therestaurant from "../services/restauranteServices";
import { useNavigate, Link } from "react-router-dom";



const ListaRestaurantes = ({ restaurantes }) => {
  const [loading, setLoading] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const [mensaje, setMensaje] = useState("");
  const token = sessionStorage.getItem("token");
  const [restaurantesLocal, setRestaurantesLocal] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(restaurantes)) {
      setRestaurantesLocal(restaurantes);
    }
  }, [restaurantes]);



  // funcion editar
  const handlerditar = (restauranteSeleccionado) => {

    navigate(`/${store.user.rol}/restaurantes/restaurant`, {
      state: { restaurante: restauranteSeleccionado }
    });

    console.log("Restaurante seleccionado:", restauranteSeleccionado);

  };


  // funcion eliminar
  const handlerEliminar = (restauranteSeleccionado) => {
    if (token && store.user.rol === "admin") {
      if (!confirm("¿Confirmas los datos introducidos?")) return
      setLoading(true);
      therestaurant.eliminarRestaurante(restauranteSeleccionado.id, token)
        .then(data => {
          setMensaje("restaurante eliminado con exito");
          setRestaurantesLocal((prev) => prev.filter((r) => r.id !== restauranteSeleccionado.id));
          dispatch({ type: "remove_restaurante", payload: restauranteSeleccionado.id });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setMensaje("No se ha podido eliminar el restaurante");
        });
    } else {
      setMensaje("No tienes permisos para eliminar restaurantes");
    }
  };
  return (

    loading ? (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    ) : (
      <div className="container">
        <h5 className="mb-3">Lista de Restaurantes</h5>
        <ul className="list-group">
          {restaurantesLocal && restaurantesLocal.map(restaurante => (
            <li
              key={restaurante.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{restaurante.nombre}</strong>
                <br />
                <small className="text-muted">{restaurante.direccion}</small>
                <br />
                <small className="text-muted">{restaurante.email_contacto}</small>
                <br />
                {restaurante.telefono &&
                  <small className="text-muted">{restaurante.telefono}</small>
                }

              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary">{`ID: ${restaurante.id}`}</span>

                <button
                  type="button"
                  onClick={() => handlerditar(restaurante)}
                  className="btn btn-sm btn-primary"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handlerEliminar(restaurante)}
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {mensaje && (
          <div
            className={`alert col-12 col-sm-12 col-md-12 col-lg-6 mt-3 text-white text-center float-end ${mensaje.toLowerCase().includes("exito") ? "bg-success" : "bg-danger"
              }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    )
  );



};

export default ListaRestaurantes;
