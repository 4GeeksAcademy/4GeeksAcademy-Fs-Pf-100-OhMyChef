import React from "react";
import { Button } from "react-bootstrap";

const VentasResumen = ({ restauranteId, mes, ventas, porcentaje }) => {
    return (
        <>
        <div className="d-flex align-items-center justify-content-end flex-wrap">
            <h5 className="me-2 mb-0">
                <span className="badge bg-orange ms-4 p-2">Ventas</span>
            </h5>
            <h5 className="mb-0 fw-bold ">RESTAURANTE {restauranteId}</h5>
        </div>


    <p className="mt-1 mb-4 text-muted">
        Mes actual: <span className="fw-bold text-danger">{mes}</span>
    </p>


    <div className="row text-center">
        <div className="col-6">
            <div className="p-2 rounded bg-info bg-opacity-25">
                <div className="fw-bold small text-dark">Ventas Actuales</div>
                <div className="fw-bold fs-4 text-dark">
                    {ventas} <small className="text-muted">$</small>
                </div>
            </div>
        </div>
        <div className="col-6">
            <div className="p-2 rounded bg-success bg-opacity-25">
                <div className="fw-bold small text-dark">Porcentaje Ventas</div>
                <div className="fw-bold fs-4 text-dark">
                    {porcentaje} <small className="text-muted">%</small>
                </div>
            </div>
        </div>
    </div>
</>


    );
};

export default VentasResumen;
