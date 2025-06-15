import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InfoCard from "../../components/InforCard"; 
import React from 'react';
import { FaUser, FaPlus, FaUtensils, FaCog } from 'react-icons/fa';
import AdminDashboardBB from "../../components/AdminDashboardBB";
import RestaurantDetail from '../../components/RestaurantDetail';
import QuickActionCard from '../../components/QuickActionCard';


export const AdminDashboard = () => {
  return (

    <AdminDashboardBB />
  );
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboardBB />} />
        <Route path="/restaurante/:id" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}