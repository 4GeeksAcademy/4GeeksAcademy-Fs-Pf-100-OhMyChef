import ListaRestaurantes from "../../pages/ListaRestaurantes";
import therestaurant from "../../services/restauranteServices";
import React, { useState, useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AdminVerRestaurante = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token && store.user?.rol === "admin" && (!store.restaurantes || store.restaurantes.length == 0)) {
            setLoading(true);
            therestaurant.getRestaurantes(token)
                .then((data) => {
                    dispatch({ type: "set_restaurante", payload: data });
                    setLoading(false);
                })
                .catch(() => {
                    sessionStorage.removeItem("token");
                    setLoading(false);
                });
        }
    }, [store.user?.rol, dispatch]);
    return (



        <>
            {loading ? (
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
                <ListaRestaurantes restaurantes={store.restaurantes} />
            )}
        </>
    );
};


export default AdminVerRestaurante;
