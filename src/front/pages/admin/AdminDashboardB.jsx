import { Link } from "react-router-dom";
import { FaPlus, FaUsers, FaHome } from "react-icons/fa";




const RestaurantCard = ({
  name,
  sales,
  salesChange,
  expensesPercent,
  expensesStatus,
  isLastCard = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      
      <h3 className="text-gray-700 font-semibold text-lg mb-4">{name}</h3>

      
      <div className="flex justify-between items-center mb-4">
        
        <div>
          <p className="text-sm text-gray-500 uppercase">Ventas mes</p>
          <p className="text-2xl font-bold text-gray-800">{sales} <span className="text-base font-medium">$</span></p>
          <p className={`text-sm ${salesChange < 0 ? "text-red-500" : "text-green-500"}`}>
            {salesChange < 0 ? `${salesChange}%` : `+${salesChange}%`}{" "}
            <span className="text-gray-400 font-normal">vs last month</span>
          </p>
        </div>

        
        <div>
          <p className="text-sm text-gray-500 uppercase">Gastos mes</p>
          <p className="text-2xl font-bold text-gray-800">{expensesPercent}%</p>
          <p className="text-sm text-gray-400">{expensesStatus}</p>
        </div>
      </div>

      
      <div className="mt-auto text-right">
        {isLastCard ? (
          <button className="text-red-600 text-sm font-medium hover:underline">
            Ver más restaurantes
          </button>
        ) : (
          <button className="text-red-600 text-sm font-medium hover:underline">
            View All
          </button>
        )}
      </div>
    </div>
  );
};


const QuickActionCard = ({ icon, title, subtitle, bgColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-150"
    >
      <div
        className={`${bgColor} rounded-full p-3 mb-4 flex items-center justify-center`}
      >
        <span className="text-xl text-gray-700">{icon}</span>
      </div>
      <p className="text-gray-800 font-semibold">{title}</p>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </button>
  );
};


const AdminDashboard = () => {
  const restaurantes = [
    {
      id: 1,
      name: "RESTAURANTE #1",
      sales: 2500,
      salesChange: -8.2,
      expensesPercent: 27,
      expensesStatus: "Dentro rango",
    },
    {
      id: 2,
      name: "RESTAURANTE #2",
      sales: 2500,
      salesChange: -8.2,
      expensesPercent: 27,
      expensesStatus: "Dentro rango",
    },
    {
      id: 3,
      name: "RESTAURANTE #3",
      sales: 2500,
      salesChange: -8.2,
      expensesPercent: 27,
      expensesStatus: "Dentro rango",
    },
    {
      id: 4,
      name: "RESTAURANTE #4",
      sales: 2500,
      salesChange: -8.2,
      expensesPercent: 27,
      expensesStatus: "Dentro rango",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, Sarah. Here’s what’s happening today.
        </p>
      </header>

      
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurantes.map((r, idx) => (
          <RestaurantCard
            key={r.id}
            name={r.name}
            sales={r.sales}
            salesChange={r.salesChange}
            expensesPercent={r.expensesPercent}
            expensesStatus={r.expensesStatus}
            isLastCard={idx === restaurantes.length - 1}
          />
        ))}
      </section>

      
      <section className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Quick Actions</h2>
          <button className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded hover:bg-red-700 transition-colors">
            Modificar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <QuickActionCard
            icon={<FaPlus />}
            title="Crear Restaurante"
            subtitle="Editar Restaurante"
            bgColor="bg-pink-100"
            onClick={() => {
            }}
          />

          <QuickActionCard
            icon={<FaUsers />}
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

export default AdminDashboard;

