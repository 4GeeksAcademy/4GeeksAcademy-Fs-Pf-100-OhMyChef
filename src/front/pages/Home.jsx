import React from "react";
import "../styles/landing_styles.css";
import { Login } from "../components/Login.jsx";
import { FooterLanding } from "../components/FooterLanding.jsx";
import bgIngredients from "../assets/img/ingredients-bg.png";

export const Home = () => {
  return (
    <>
      <div
        className="container-fluid landing-container"
        style={{ backgroundImage: `url(${bgIngredients})` }}
      >
        <div className="row align-items-center main-row">
          <div className="col-lg-6 col-12 text-center text-lg-start landing-message">
            <h1>Gestiona tus gastos</h1>
            <p>Inicia sesión para llevar un control de tu inversión culinaria.</p>
          </div>

          <div className="col-lg-5 col-md-8 col-11 mx-auto login-overlay">
            <Login />
          </div>
        </div>
        <FooterLanding />
      </div>
    </>
  );
};




