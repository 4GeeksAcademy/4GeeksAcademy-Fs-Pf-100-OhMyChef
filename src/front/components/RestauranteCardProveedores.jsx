import React from 'react';
import "../styles/RestauranteCardProveedores.css";

const RestauranteCardProveedores = ({ restaurant, onViewAll }) => {
    const { id, name, city, zone, percentage, status } = restaurant;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>{name}</h2>
                <span className={styles.zone}>{zone}</span>
            </div>
            <div className={styles.cardContent}>
                <p className={styles.city}>{city}</p>
                <p className={styles.percentage}>{percentage}%</p>
            </div>
            <div className={styles.cardFooter}>
                <span className={styles.status}>{status}</span>
                <button onClick={() => onViewAll(id)} className={styles.viewAllButton}>View All</button>
            </div>
        </div>
    );
};

export default RestauranteCardProveedores;