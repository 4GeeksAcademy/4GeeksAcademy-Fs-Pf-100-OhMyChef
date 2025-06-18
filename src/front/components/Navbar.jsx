import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const user = store.user;

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2">
      <div className="container-fluid align-items-center mx-4">
        <a className="navbar-brand" href="#">
          <img
            src="/docs/assets/ohmychef 312.png"
            alt="OhMyChef Logo"
            width="200"
            height="55"
          />
        </a>

        {/* barra centra de search comentada */}
        {/* <div className="wrapper-for">
          <div className="" id="navbarContent">
            <form className="d-flex mx-auto my-2 my-lg-0">
              <input
                className="form-control form-control-search"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>
          </div>
        </div> */}
        <ul className="navbar-nav ms-auto d-flex align-items-center ps-md-4 gap-3">
          <li className="nav-item position-relative">
            <i className="bi bi-bell me-0 fs-t"></i>
            <span className="notify-dot bg-danger rounded-circle position-absolute top-0 start-100 translate-middle p-1"></span>
          </li>
          <li className="nav-item d-flex align-items-center gap-2">
            <div className="text-end">
              <p className="mb-0 name">{user.nombre}</p>
              <p className="mb-0 role text-muted small text-capitalize">{user.rol}</p>
              <p className="mb-0 restaurant text-secondary small">
                {user.restaurante_nombre || "Sin restaurante asignado"}
              </p>
            </div>
            <i className="bi bi-person-circle fs-1"></i>
          </li>
        </ul>
      </div>
    </nav>
  );
};
