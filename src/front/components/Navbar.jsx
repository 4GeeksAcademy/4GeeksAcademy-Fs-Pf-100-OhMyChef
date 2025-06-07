import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const user = store.user;

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 vh-10">
      <div className="container-fluid mx-4">
        <a className="navbar-brand" href="#">
          <img
            src="/docs/assets/ohmychef 312.png"
            alt="OhMyChef Logo"
            width="200"
            height="55"
          />
        </a>
        <button className="btn d-lg-none" type="button">
          <i className="bi bi-search"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <form className="d-flex mx-auto my-2 my-lg-0">
            <input
              className="form-control form-control-search"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
        </div>
        <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
          <li className="nav-item position-relative">
            <i className="bi bi-bell fs-4"></i>
            <span className="notify-dot bg-danger rounded-circle position-absolute top-0 start-100 translate-middle p-1"></span>
          </li>
          <li className="nav-item d-flex align-items-center gap-2">
            <i className="bi bi-person-circle fs-1"></i>
            <div className="text-end">
              <p className="mb-0 name">{user.nombre}</p>
              <p className="mb-0 role text-muted small text-capitalize">{user.rol}</p>
              <p className="mb-0 restaurant text-secondary small">
                {user.restaurante_nombre || "Sin restaurante asignado"}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};
