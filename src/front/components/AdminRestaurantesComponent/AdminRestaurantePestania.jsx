
import useGlobalReducer from "../../hooks/useGlobalReducer";

import { useEffect, useState } from "react";
import userServices from "../../services/userServices";
import therestaurant from "../../services/restauranteServices";
import { useLocation } from "react-router-dom";


const AdminRestaurantePestania = () => {
    const { store, dispatch } = useGlobalReducer();
    const [mensaje, setMensaje] = useState("");
    const location = useLocation();
    const restaurante = location.state?.restaurante;
    const [restaurantes, SetRestaurantes] = useState({
        nombre: "",
        direccion: "",
        email_contacto: "",
        telefono: ""

    });
    const [usuarios, setUsuarios] = useState([])
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // ✅ Corrección aquí (nueva línea 15 aprox.)
    useEffect(() => {
        if (restaurante) {
            SetRestaurantes(restaurante);
        }
    }, [restaurante]);




    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token && store.user.rol == "admin") {
            userServices.getUsuarios(token)
                .then(data => {
                    setUsuarios(data)
                })
                .catch(() => {
                    sessionStorage.removeItem("token");
                });
        }
    }, [store.user]);




    // INICIO FUNCIONES ///////////////
    const handleChange = (e) => {
        const { name, value } = e.target;
        SetRestaurantes((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (restaurante) {
            therestaurant.actualizarRestaurante(restaurantes)
                .then((data) => {
                    setMensaje("restaurante actualizado con exito");
                    dispatch({ type: "actualizar_restaurante", payload: restaurantes });
                    SetRestaurantes(restaurantes)
                    return data
                })
                .catch(() => setMensaje("Error al registrar gastos"));
        }
        else {
            const { nombre, direccion, email_contacto, telefono } = restaurantes;
            if (!nombre || !direccion || !email_contacto) {
                setMensaje("Por favor completa todos los campos obligatorios");
                return;
            }

            if (!confirm("¿Confirmas los datos introducidos?")) return
            const restaurante = {
                ...restaurantes,
                nombre,
                direccion,
                email_contacto,
                telefono
            };
            therestaurant.crearRestaurante(restaurante)
                .then((data) => {
                    restaurante.id = data.nuevo.id
                    setMensaje("restaurante registrado con exito");
                    SetRestaurantes(data.nuevo);
                    dispatch({ type: "add_restaurante", payload: data.nuevo });
                    return data.nuevo
                })
                .catch(() => setMensaje("Error al registrar gastos"));
        }

    };


    // INICIO HTML ///////////////
    return (

        <>
            <h5 className="mb-4">Perfil de Restaurantess</h5>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    {/* <div className="col-12 col-md-2 d-flex flex-column align-items-center mb-3 mb-md-0">
                        <div className="border rounded p-2 text-center mb-2 w-100 bg-light">
                            {preview ? (
                                <img src={preview} alt="Preview" className="img-fluid rounded" />
                            ) : (
                                <i className="bi bi-building" style={{ fontSize: "2rem" }}></i>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control form-control-sm"
                        />
                    </div> */}

                    <div className="col-12 col-md-12">
                        <div className="mb-3">
                            <label className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={restaurantes.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Business Address</label>
                            <textarea
                                className="form-control"
                                name="direccion"
                                rows="2"
                                value={restaurantes.direccion}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email_contacto"
                                    value={restaurantes.email_contacto}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="telefono"
                                    value={restaurantes.telefono}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div class="row">
                            {/* <div class="col-12 col-md-6 mb-3"><label class="form-label">Responsable</label>
                            <select class="form-select" name="responsable">
                                <option>Encargado</option>
                                <option>Subencargado</option>
                            </select>
                        </div> */}
                            <div class="col-12 col-md-12 mb-3 d-flex align-items-end justify-content-end" >
                                <button type="submit" class="btn w250 bg-orange text-white px-3">Save Changes</button>
                            </div>
                        </div>
                        {mensaje && (
                            <div
                                className={`alert col-12 col-sm-12 col-md-12 col-lg-6 mt-3 text-white text-center float-end ${mensaje.toLowerCase().includes("exito") ? "bg-success" : "bg-danger"
                                    }`}
                            >
                                {mensaje}
                            </div>
                        )}
                    </div>
                </div>
            </form >
            {/* <div className="d-flex w-100 searchRestaurant">
                <p >Busqueda de resraurante</p>
                <div className="flex-1">
                    <label className="form-label mt-3">Date</label>
                    <input type="date" className="form-control searchRestaurant" value="01/11/2023" />
                </div>
            </div> 
            <div className="d-grid mt-3 ms-auto"><button type="submit" className="btn w250 bg-primary text-white px-4">Buscar</button></div>*/}
        </>
    )

}

export default AdminRestaurantePestania;