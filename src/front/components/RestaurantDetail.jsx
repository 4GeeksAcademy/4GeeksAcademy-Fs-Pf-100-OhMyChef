import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '../styles/RestaurantDetail.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RestaurantDetail = () => {
  const { id } = useParams();
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/restaurants/${id}/sales.json`).then(res => res.json()),
      fetch(`/api/restaurants/${id}/categories.json`).then(res => res.json())
    ])
      .then(([sales, categories]) => {
        setSalesData(sales);
        setCategoryData(categories);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="restaurant-detail-container">
      <div className="header">
        <h1>Restaurante #{id}</h1>
        <Link to="/" className="back-btn">← Volver al dashboard</Link>
      </div>

      {loading && <p>Cargando datos...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="chart-container">
            <h2>Ventas Mensuales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => `$${value}`} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2>Distribución por Categoría</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <div className="table-section">
        <h2>Movimientos Recientes</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-06-01</td>
              <td>Venta menú ejecutivo</td>
              <td>$120</td>
              <td>Ingreso</td>
            </tr>
            <tr>
              <td>2025-06-02</td>
              <td>Compra ingredientes</td>
              <td>$65</td>
              <td>Gasto</td>
            </tr>
            <tr>
              <td>2025-06-03</td>
              <td>Pago delivery</td>
              <td>$30</td>
              <td>Gasto</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantDetail;