import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [seemenu, setSeemenu] = useState(true);
  const [menuall, setMenuall] = useState(false);
  const { store } = useGlobalReducer();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    setSeemenu(!seemenu);
    setMenuall(!menuall);
  };

  const rol = store?.user?.rol;

  return (
    <div className="d-flex vh-90">
      <nav
        id="sidebar"
        className={`sidebar menu d-flex flex-column p-3 col-3 col-md-2 ${menuall ? "w150" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className={`fs-5 menu fw-bold ${seemenu ? "d-none" : ""}`}>Menú</span>
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
            {/* ADMIN */}
            {rol === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard"><i className="bi bi-house me-2"></i>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/restaurantes"><i className="bi bi-shop me-2"></i>Restaurantes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/ventas"><i className="bi bi-bar-chart me-2"></i>Ventas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/gastos"><i className="bi bi-cash-coin me-2"></i>Gastos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios"><i className="bi bi-people me-2"></i>Usuarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/settings"><i className="bi bi-gear me-2"></i>Configuración</Link>
                </li>
              </>
            )}

            {/* ENCARGADO */}
            {rol === "encargado" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/dashboard"><i className="bi bi-house me-2"></i>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/ventas"><i className="bi bi-bar-chart me-2"></i>Ventas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/gastos"><i className="bi bi-cash-stack me-2"></i>Gastos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/proveedores"><i className="bi bi-truck me-2"></i>Proveedores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encargado/settings"><i className="bi bi-gear me-2"></i>Configuración</Link>
                </li>
              </>
            )}

            {/* CHEF */}
            {rol === "chef" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/dashboard"><i className="bi bi-house me-2"></i>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/proveedores"><i className="bi bi-truck me-2"></i>Proveedores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/facturas"><i className="bi bi-receipt me-2"></i>Facturas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chef/settings"><i className="bi bi-gear me-2"></i>Configuración</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="logout mt-auto">
          <Link
            className={`nav-link text-muted d-flex align-items-center ${menuall ? "logout-row" : "logout-column"}`}
            to="/login"
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
