import AdminExpensePestania from "./AdminExpensePestania";
import AdminRestaurantePestania from "./AdminRestaurantePestania";
import AdminNotificationsPestania from "./AdminNotificationsPestania";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import '../../styles/AdminRestauranteComponent.css';
// import '../styles/AdminDashboardBB.css';


const AdminRestauranteComponent = () => {
    const location = useLocation();
    return (
        <div className="dashboard-container px-0 py-3 pt-4 row">
            <h1 className="dashboard-title ">Restaurantes</h1>
            <p class="dashboard-welcome mb-2">Añade tu Restaurante</p>

            <div className="col-12 col-sm-12 col-md-11 col-lg-10 col-xl-9 col-xxl-8 mt-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.endsWith("restaurant") ? "active" : ""}`} to="restaurant">
                            Restaurante
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.endsWith("expense") ? "active" : ""}`} to="expense">
                            Expense
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.endsWith("notifications") ? "active" : ""}`} to="notifications">
                            Notifications
                        </Link>
                    </li>
                </ul>


                <div className="card p-4">
                    <Routes>
                        <Route path="restaurant" element={<AdminRestaurantePestania />} />
                        <Route path="expense" element={<AdminExpensePestania />} />
                        <Route path="notifications" element={<AdminNotificationsPestania />} />
                        <Route path="/" element={<Navigate to="restaurant" replace />} />
                    </Routes>
                </div>

            </div>
        </div>
    )

}

export default AdminRestauranteComponent;