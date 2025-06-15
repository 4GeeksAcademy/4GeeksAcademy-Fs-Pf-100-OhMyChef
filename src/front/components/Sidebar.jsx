import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [seemenu, setSeemenu] = useState(true);
  const [menuall, setMenuall] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const rol = store?.user?.rol;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    setSeemenu(!seemenu);
    setMenuall(!menuall);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch({ type: "get_user_info", payload: null });
    navigate("/");
  };

  return (
    <div className="sidebar-container d-flex">
      <nav
        id="sidebar"

        className={`sidebar menu d-flex flex-column p-3 ${menuall ? "w200" : ""
          }`}

      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className={`fs-5 menu fw-bold ${seemenu ? "d-none" : ""}`}>
            Menú
          </span>
          <button
            className="btn btn-light d-md-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuItems"
            onClick={toggleCollapse}
          >
            <i className={`bi bi-chevron-right ${collapsed ? "rotated" : ""}`}></i>
          </button>
        </div>
        <div className="collapse chefmenu d-md-block" id="menuItems">
          <ul className="nav nav-pills flex-column">
            {rol === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-house me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/restaurantes">
                    <i className="bi bi-shop me-2"></i>Restaurantes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/ventas">
                    <i className="bi bi-bar-chart me-2"></i>Ventas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/gastos">
                    <i className="bi bi-cash-coin me-2"></i>Gastos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/proveedores">
                    <i className="bi bi-shop me-2"></i>Proveedores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios">
                    <i className="bi bi-people me-2"></i>Usuarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/settings">
                    <i className="bi bi-gear me-2"></i>Configuración
                  </Link>
                </li>
              </>
            )}
            {rol === "encargado" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/dashboard">
                    <i className="bi bi-house me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/ventas">
                    <i className="bi bi-bar-chart me-2"></i>Ventas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/gastos">
                    <i className="bi bi-cash-stack me-2"></i>Gastos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/proveedores">
                    <i className="bi bi-truck me-2"></i>Proveedores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/settings">
                    <i className="bi bi-gear me-2"></i>Configuración
                  </Link>
                </li>
              </>
            )}
            {rol === "chef" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/dashboard">
                    <i className="bi bi-house me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/proveedores">
                    <i className="bi bi-truck me-2"></i>Proveedores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/gastos">
                    <i className="bi bi-receipt me-2"></i>Gastos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/settings">
                    <i className="bi bi-gear me-2"></i>Configuración
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="logout mt-auto">
          <button
            className={`nav-link text-muted d-flex align-items-center bg-transparent border-0 ${!menuall ? "logout-row" : "logout-column"
              }`}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            <span className={`${menuall ? "w-60" : "w-auto"}`}>Cerrar sesión</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
