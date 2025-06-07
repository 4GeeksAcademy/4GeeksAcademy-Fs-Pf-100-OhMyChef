import React from "react";
import logo from "../assets/img/logo.svg";

export const LoadingScreen = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <img
        src={logo}
        alt="OhMyChef Logo"
        className="logo-pulse"
        style={{ width: "160px" }}
      />
      <p className="mt-4 fs-5">Cocinando tu experiencia...</p>
    </div>
  );
};
