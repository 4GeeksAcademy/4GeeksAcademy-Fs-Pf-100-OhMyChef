import React from 'react';
import './../styles/ProveedoresCardRestaurante.css';

export const ProveedoresCardRestaurante = ({ restaurante, onViewAll }) => {
    const { id, name, city, zone, percentage, status } = restaurante;

    return (
        <div className="proveedor-card">
            <div className="proveedor-header">
                <span>{name}</span>
                <span className="proveedor-zone">{zone}</span>
            </div>

            <div className="proveedor-body">
                <p className="proveedor-city">{city}</p>
                <p className="proveedor-percentage">{percentage}%</p>
            </div>

            <div className="proveedor-footer">
                <span className="proveedor-status">{status}</span>
                <span
                    onClick={() => onViewAll(id)}
                    className="proveedor-view-all"
                >
                    View All
                </span>
            </div>
        </div>
    );
};