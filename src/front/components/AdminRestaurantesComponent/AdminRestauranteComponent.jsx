import AdminVerRestaurante from "./AdminVerRestaurante";
import AdminRestaurantePestania from "./AdminRestaurantePestania";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import '../../styles/AdminRestauranteComponent.css';
// import '../styles/AdminDashboardBB.css';


const AdminRestauranteComponent = () => {
    const location = useLocation();
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title ">Restaurantes</h1>
            <p className="dashboard-welcome mb-2">Añade tu Restaurante</p>

            <div className="col-12 col-sm-12 col-md-9 col-lg-7 col-xl-7 col-xxl-6 mt-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link className={`nav-link pestania ${location.pathname.endsWith("restaurant") ? "active" : ""}`} to="restaurant">
                            Crear restaurantes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link pestania ${location.pathname.endsWith("expense") ? "active" : ""}`} to="expense">
                            Ver Restaurantes
                        </Link>
                    </li>
                </ul>


                <div className="card p-4">
                    <Routes>
                        <Route path="restaurant" element={<AdminRestaurantePestania />} />
                        <Route path="expense" element={<AdminVerRestaurante />} />
                        <Route path="/" element={<Navigate to="restaurant" replace />} />
                    </Routes>
                </div>

            </div>
        </div>
    )

}

export default AdminRestauranteComponent;