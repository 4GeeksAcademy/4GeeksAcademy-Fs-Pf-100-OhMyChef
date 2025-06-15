import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.svg";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = emailConfirmed
      ? `${import.meta.env.VITE_BACKEND_URL}/api/reset-password`
      : `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`;
    const payload = emailConfirmed
      ? { email, new_password: newPassword }
      : { email };
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      setMessage(data.msg);
      if (resp.ok && !emailConfirmed) {
      const messageText = data.msg === "Revisa tu correo electrónico"
        ? "Correo existente"
        : data.msg;
      setMessage(messageText);
      setEmailConfirmed(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error.");
    }
  };
  return (
    <div className="text-center px-4">
      
      <img
        src={logo}
        alt="Chef Logo"
        className="img-fluid mb-2 mx-auto"
        style={{ height: "100px" }}
      />
      <h2 className="login-title text-black text-center mt-4 mb-3">
        Recuperar contraseña
      </h2>
      
      {message && <div className="alert alert-info text-start">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder="Introduce tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {emailConfirmed && (
          <>
            <div className="mb-3 text-start">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirma la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="btn bg-orange text-white w-100">
          {emailConfirmed ? "Cambiar contraseña" : "Enviar"}
        </button>
      </form>
      {message === "Contraseña actualizada correctamente" && (
        <button
          className="btn bg-orange text-white mt-3 w-100"
          onClick={() => navigate("/")}
        >
          Volver al login
        </button>
      )}
    </div>
  );
};
export default ForgotPassword;









































































