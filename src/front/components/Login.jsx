import React, { useState, useEffect } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logo.svg";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userServices
      .login(FormData)
      .then((data) => {
        if (!data || !data.access_token) {
          setErrorMessage("Credenciales incorrectas");
        } else {
          sessionStorage.setItem("token", data.access_token);
          dispatch({ type: "get_user_info", payload: data.user });
          navigate(`/${data.user.rol}/dashboard`);
        }
      })
      .catch(() => setErrorMessage("Hubo un error en el login"));
  };

  return (
    <div className="text-center px-4">
      <div className="login-title text-white text-start mx-4 mt-4">
        Iniciar sesión
      </div>

      <img
        src={logo}
        alt="Chef Logo"
        className="img-fluid mb-3"
        style={{ height: "150px" }}
      />

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label htmlFor="username" className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="username"
            className="form-control"
            placeholder="Introduce tu email"
            value={FormData.email}
            onChange={handleChange}
          />
          <small className="text-muted">Tu usuario único</small>
        </div>

        <div className="mb-3 text-start">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            placeholder="Introduce tu contraseña"
            value={FormData.password}
            onChange={handleChange}
          />
          <small className="text-muted">Tu contraseña segura</small>
        </div>

        <button type="submit" className="btn bg-orange text-white w-100">
          Entrar
        </button>

        <div className="mt-3">
          <Link to="/forgot-password" className="text-muted">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};
