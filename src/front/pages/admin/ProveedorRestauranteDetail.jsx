import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ProveedorRestauranteDetail.css';

const ProveedorRestauranteDetail = () => {
    
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
            <div className={styles.detailContainer}>
                <h1>Restaurante no encontrado</h1>
                <button onClick={() => navigate('/')} className={styles.backButton}>Volver al Dashboard</button>
            </div>
        );
    }

    return (
        <div className={styles.detailContainer}>
            <button onClick={() => navigate('/')} className={styles.backButton}>← Volver a Proveedores</button>
            <h1>Detalles de {restaurant.name}</h1>
            <p><strong>Ciudad:</strong> {restaurant.city}</p>
            <p><strong>Zona:</strong> {restaurant.zone}</p>
            <p><strong>Porcentaje:</strong> {restaurant.percentage}%</p>
            <p><strong>Estado:</strong> <span className={styles.statusDetail}>{restaurant.status}</span></p>
            <p><strong>Descripción:</strong> {restaurant.description}</p>
            {/* Aquí podrías añadir más detalles como una lista de proveedores asociados, etc. */}
        </div>
    );
};

export default ProveedorRestauranteDetail;