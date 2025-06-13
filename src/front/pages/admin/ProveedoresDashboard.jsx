import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProveedoresCardRestaurante } from '../../components/ProveedoresCardRestaurante.jsx';
import '../../styles/ProveedoresDashboard.css';

export const ProveedoresDashboard = () => {
    const navigate = useNavigate();

    const restaurantes = [
        { id: '1', name: 'RESTAURANTE # 1', city: 'Valencia', zone: 'zona 1', percentage: 27, status: 'Activo' },
        { id: '2', name: 'RESTAURANTE # 2', city: 'Barcelona', zone: 'zona 2', percentage: 27, status: 'Activo' },
        { id: '3', name: 'RESTAURANTE # 3', city: 'Valencia', zone: 'zona 2', percentage: 27, status: 'Activo' },
        { id: '4', name: 'RESTAURANTE # 4', city: 'Valencia', zone: 'zona 3', percentage: 27, status: 'Activo' },
    ];

    const handleViewAll = (restauranteId) => {
        navigate(`/admin/proveedores/restaurante/${restauranteId}`);
    };

    return (
        <div className="dashboard-container p-6 bg-gray-100 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Proveedor</h1>
                <p className="text-gray-600">Proveedor por restaurante</p>
            </header>

            <main className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurantes.map((restaurante) => (
                    <ProveedoresCardRestaurante
                        key={restaurante.id}
                        restaurante={restaurante}
                        onViewAll={handleViewAll}
                    />
                ))}
            </main>
        </div>
    );
};
