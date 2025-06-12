import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestauranteCardProveedores from '../../components/RestauranteCardProveedores';
import '../../styles/ProveedoresDashboard.css';

const ProveedoresDashboard = () => {
    const navigate = useNavigate();


    const restaurantes = [
        { id: '1', name: 'RESTAURANTE # 1', city: 'Valencia', zone: 'zona 1', percentage: 27, status: 'Activo' },
        { id: '2', name: 'RESTAURANTE # 2', city: 'Barcelona', zone: 'zona 2', percentage: 27, status: 'Activo' },
        { id: '3', name: 'RESTAURANTE # 3', city: 'Valencia', zone: 'zona 2', percentage: 27, status: 'Activo' },
        { id: '4', name: 'RESTAURANTE # 4', city: 'Valencia', zone: 'zona 3', percentage: 27, status: 'Activo' },
    ];


    const handleViewAll = (restauranteId) => {
        navigate(`/restaurantes/${restauranteId}`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Proveedor</h1>
                <p>proveedor por restaurante</p>
            </header>

            <main className={styles.gridContainer}>
                {restaurants.map(restaurante => (
                    <RestaurantCard
                        key={restaurante.id}
                        restaurant={restaurante}
                        onViewAll={handleViewAll}
                    />
                ))}
            </main>
        </div>
    );
};

export { ProveedoresDashboard };