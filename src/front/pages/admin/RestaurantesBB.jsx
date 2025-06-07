
//import React from "react";

// export const Restaurantes = () => {
//   return (
//     <div className="container py-4">
//       <h1 className="mb-3">Restaurantes</h1>

//     </div>
//   );
// };


import React, { useState } from "react";


import {
  FaDollarSign,
  FaArrowDown,
  FaArrowUp,
  FaClock,
  FaCalendarAlt,
  FaUserAlt,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

//import QuickActionCard from "./QuickActionCard"; 

export const RestaurantesBB = () => {


  const lineData = [
    { day: 1, value: 50 },
    { day: 2, value: 20 },
    { day: 3, value: 90 },
    { day: 4, value: 60 },
    { day: 5, value: 40 },
    { day: 6, value: 30 },
    { day: 7, value: 20 },
    { day: 8, value: 70 },
    { day: 9, value: 50 },
    { day: 10, value: 45 },
    { day: 11, value: 35 },
    { day: 12, value: 30 },
    { day: 13, value: 28 },
    { day: 14, value: 25 },
    { day: 15, value: 30 },
    { day: 16, value: 40 },
    { day: 17, value: 55 },
    { day: 18, value: 60 },
    { day: 19, value: 70 },
    { day: 20, value: 80 },
    { day: 21, value: 75 },
    { day: 22, value: 85 },
    { day: 23, value: 90 },
    { day: 24, value: 65 },
    { day: 25, value: 50 },
    { day: 26, value: 45 },
    { day: 27, value: 55 },
    { day: 28, value: 60 },
    { day: 29, value: 70 },
    { day: 30, value: 80 },
    { day: 31, value: 75 },
  ];


  const pieData = [
    { name: "Ingredientes", value: 400 },
    { name: "Proveedores", value: 300 },
    { name: "Marketing", value: 200 },
    { name: "Otros", value: 250 },
    { name: "Gastos", value: 350 },
  ];
  const COLORS = ["#FF4500", "#004D40", "#9C27B0", "#FFC107", "#4CAF50"];

  const RestaurantDetail = () => {
    // Estados para fecha inicial y final
    const [startDate, setStartDate] = useState("2023-01-01");
    const [endDate, setEndDate] = useState("2023-01-01");
    const [viewMode, setViewMode] = useState("week"); // puede ser "week", "month", etc.
    const [activeTab, setActiveTab] = useState("gastos-fechas"); // "gastos-fechas" o "gastos-proveedor"


    const gastosActuales = 2500;
    const porcentajeGastos = 27;
    const totalComprado = 289000;
    const cambioTotalComprado = 12.5; // positivo → texto verde
    const totalGastos = 212000;
    const cambioTotalGastos = -8.2; // negativo → texto rojo
    const nuevoGasto = 77000;
    const cambioNuevoGasto = 15.3;
    const margenGasto = 26.6;
    const cambioMargenGasto = 2.1;

    return (
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="flex items-center space-x-4 mb-8">

          <button
            onClick={() => {
            }}
            className="text-sm text-gray-500 hover:underline flex items-center"
          >
            <FaArrowUp className="mr-1" />
            Ir a Ventas
          </button>


          <div className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full">
            Gastos
          </div>


          <h1 className="text-2xl font-bold text-gray-800">RESTAURANTE 1231</h1>
        </div>


        <div className="mb-6">
          <span className="text-gray-600">Mes actual: </span>
          <span className="font-medium text-gray-800">Mayo 2025</span>
        </div>


        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-8">

          <div className="bg-teal-100 rounded-lg p-4 flex-1 mb-4 sm:mb-0">
            <p className="text-sm text-gray-600 uppercase">Gastos Actuales</p>
            <p className="text-2xl font-bold text-gray-800">{gastosActuales} $</p>
          </div>

          <div className="bg-green-100 rounded-lg p-4 flex-1">
            <p className="text-sm text-gray-600 uppercase">Porcentaje Gastos</p>
            <p className="text-2xl font-bold text-gray-800">{porcentajeGastos} %</p>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-6 border-b border-gray-200 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("gastos-fechas")}
              className={`flex items-center space-x-2 pb-2 ${activeTab === "gastos-fechas"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <FaCalendarAlt />
              <span>Gastos por fechas</span>
            </button>
            <button
              onClick={() => setActiveTab("gastos-proveedor")}
              className={`flex items-center space-x-2 pb-2 ${activeTab === "gastos-proveedor"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <FaUserAlt />
              <span>Gastos por Proveedor</span>
            </button>
          </div>


          {activeTab === "gastos-fechas" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              { }
              <div>
                <label className="block text-gray-500 text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              { }
              <div>
                <label className="block text-gray-500 text-sm mb-1">to</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              {/* Selección de Vista */}
              <div>
                <label className="block text-gray-500 text-sm mb-1">Vista por</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="year">Last year</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Aquí va el filtro por proveedor…</div>
          )}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-500 uppercase">Total comprado</h3>
              <div className="bg-blue-50 rounded-full p-2">
                <FaDollarSign className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">${totalComprado.toLocaleString()}</p>
            <p
              className={`mt-2 text-sm font-medium ${cambioTotalComprado < 0 ? "text-red-500" : "text-green-500"
                }`}
            >
              {cambioTotalComprado < 0
                ? `${cambioTotalComprado}%`
                : `+${cambioTotalComprado}%`}{" "}
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>


          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-500 uppercase">Total gastos</h3>
              <div className="bg-red-50 rounded-full p-2">
                <FaArrowDown className="text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">${totalGastos.toLocaleString()}</p>
            <p
              className={`mt-2 text-sm font-medium ${cambioTotalGastos < 0 ? "text-red-500" : "text-green-500"
                }`}
            >
              {cambioTotalGastos < 0
                ? `${cambioTotalGastos}%`
                : `+${cambioTotalGastos}%`}{" "}
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>


          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-500 uppercase">Nuevo gasto</h3>
              <div className="bg-yellow-50 rounded-full p-2">
                <FaArrowUp className="text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">${nuevoGasto.toLocaleString()}</p>
            <p
              className={`mt-2 text-sm font-medium ${cambioNuevoGasto < 0 ? "text-red-500" : "text-green-500"
                }`}
            >
              {cambioNuevoGasto < 0
                ? `${cambioNuevoGasto}%`
                : `+${cambioNuevoGasto}%`}{" "}
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>


          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-500 uppercase">Margen de gasto</h3>
              <div className="bg-green-50 rounded-full p-2">
                <FaClock className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{margenGasto.toFixed(1)} %</p>
            <p
              className={`mt-2 text-sm font-medium ${cambioMargenGasto < 0 ? "text-red-500" : "text-green-500"
                }`}
            >
              {cambioMargenGasto < 0
                ? `${cambioMargenGasto}%`
                : `+${cambioMargenGasto}%`}{" "}
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Gastos por día (Mayo 2025)
          </h3>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="day" tickLine={false} />
                <YAxis tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => `Día ${label}`}
                />
                <Line type="monotone" dataKey="value" stroke="#8A2BE2" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-4 mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Relación por categoría</h3>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Quick Actions</h2>
            <button className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded hover:bg-red-700 transition-colors">
              Modificar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <QuickActionCard
              icon={<FaArrowUp />}
              title="Crear Restaurante"
              subtitle="Editar Restaurante"
              bgColor="bg-pink-100"
              onClick={() => {
              }}
            />

            <QuickActionCard
              icon={<FaUserAlt />}
              title="Manage Users"
              subtitle="Editar usuarios"
              bgColor="bg-green-100"
              onClick={() => {
              }}
            />

            <QuickActionCard
              icon={<FaHome />}
              title="Volver Dashboard"
              subtitle="menu principal del admin"
              bgColor="bg-yellow-100"
              onClick={() => {
              }}
            />
          </div>
        </section>
      </div>
    );
  };


}