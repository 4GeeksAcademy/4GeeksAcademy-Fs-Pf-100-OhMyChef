import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUsers, FaHome } from 'react-icons/fa';
import '../styles/AdminDashboardBB.css';
import QuickActionCard from '../components/QuickActionCard';
import { QuickActionsEncargado } from "../components/QuickActionsEncargado";
const restaurants = [1, 2, 3, 4];

const AdminDashboardBB = () => {
  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboarddd</h1>
        <p className="dashboard-welcome">Welcome back, Sarah. Here's what's happening today.</p>

        <div className="restaurant-cards">
          {restaurants.map((num) => (
            <div key={num} className="restaurant-card">
              <h3>RESTAURANTE
                <span className="color-orange"> # {num}</span>
              </h3>
              <div className="card-metrics">
                <div className="metric">
                  <p className="label">VENTAS mes</p>
                  <p className="value">$2500</p>
                  <p className="change down">-8.2% vs last month</p>
                </div>
                <div className="metric">
                  <p className="label">GASTOS mes</p>
                  <p className="value">27%</p>
                  <p className="status">Dentro rango</p>
                </div>
              </div>
              <Link to={`/restaurante/${num}`} className="view-link">View All</Link>
            </div>
          ))}
        </div>

        {/* <div className="quick-actions-section">
          <div className="quick-actions-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <QuickActionCard
              icon={<FaPlus />}
              title="Crear Restaurante"
              subtitle="Editar Restaurante"
              onClick={() => console.log('Crear Restaurante')}
            />
            <QuickActionCard
              icon={<FaUsers />}
              title="Manage Users"
              subtitle="Editar usuarios"
              onClick={() => console.log('Manage Users')}
            />
            <QuickActionCard
              icon={<FaHome />}
              title="Volver Dashboard"
              subtitle="Menú principal del admin"
              onClick={() => console.log('Volver Dashboard')}
            />
          </div>
        </div> */}
        <div className="mt-4 rounded p-4">
          <QuickActionsEncargado />
        </div>
      </div>

    </>
  );
};

export default AdminDashboardBB;