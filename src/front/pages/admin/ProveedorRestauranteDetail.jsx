import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ProveedorRestauranteDetail.css';

export const ProveedorRestauranteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const mockRestaurantes = [
        { id: '1', name: 'RESTAURANTE # 1', city: 'Valencia', zone: 'zona 1', percentage: 27, status: 'Activo', description: 'Detalles completos del restaurante número 1 en Valencia.' },
        { id: '2', name: 'RESTAURANTE # 2', city: 'Barcelona', zone: 'zona 2', percentage: 27, status: 'Activo', description: 'Información detallada del restaurante número 2 en Barcelona.' },
        { id: '3', name: 'RESTAURANTE # 3', city: 'Valencia', zone: 'zona 2', percentage: 27, status: 'Activo', description: 'Detalles del restaurante número 3, también en Valencia.' },
        { id: '4', name: 'RESTAURANTE # 4', city: 'Valencia', zone: 'zona 3', percentage: 27, status: 'Activo', description: 'Aquí encontrarás toda la información sobre el restaurante 4.' },
    ];

    const restaurante = mockRestaurantes.find(r => r.id === id);

    if (!restaurante) {
        return (
            <div className="detail-container">
                <h1>Restaurante no encontrado</h1>
                <button onClick={() => navigate('/admin/proveedores')} className="back-button">Volver al Dashboard</button>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <button onClick={() => navigate('/admin/proveedores')} className="back-button">← Volver a Proveedores</button>
            <h1>Detalles de {restaurante.name}</h1>
            <p><strong>Ciudad:</strong> {restaurante.city}</p>
            <p><strong>Zona:</strong> {restaurante.zone}</p>
            <p><strong>Porcentaje:</strong> {restaurante.percentage}%</p>
            <p><strong>Estado:</strong> <span className="status-detail">{restaurante.status}</span></p>
            <p><strong>Descripción:</strong> {restaurante.description}</p>
        </div>
    );
};
