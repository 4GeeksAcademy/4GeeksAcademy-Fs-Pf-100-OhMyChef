import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Login } from "./components/Login.jsx";
import { RutaPrivada } from "./components/RutaPrivada.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Restaurantes } from "./pages/admin/Restaurantes";
import { CrearRestaurante } from "./pages/admin/CrearRestaurante";
import { AdminVentas } from "./pages/admin/AdminVentas";
import { AdminGastos } from "./pages/admin/AdminGastos";
import { Usuarios } from "./pages/admin/Usuarios";
import { CrearUsuario } from "./pages/admin/CrearUsuario";
import { ConfigAdmin } from "./pages/configuracion/ConfigAdmin.jsx";
import { ProveedoresDashboard } from "./pages/admin/ProveedoresDashboard";
import { ProveedorRestauranteDetail }  from "./pages/admin/ProveedorRestauranteDetail";



import { EncargadoDashboard } from "./pages/encargado/EncargadoDashboard";
import { RegistrarVenta } from "./pages/encargado/RegistrarVenta";
import { ReporteVentas } from "./pages/encargado/ReporteVentas";
import ConfigEncargado from "./pages/configuracion/ConfigEncargado.jsx";
import { RegistrarGasto as RegistrarGastoEncargado } from "./pages/encargado/RegistrarGasto";
import { Proveedores as ProveedoresEncargado } from "./pages/encargado/Proveedores";
import { EncargadoVentas } from "./pages/encargado/EncargadoVentas";
import { EncargadoGastos } from "./pages/encargado/EncargadoGastos";
import { ProveedorForm } from "./components/shared/ProveedorForm";



import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { ChefProveedores } from "./pages/chef/ChefProveedores";
import { Facturas } from "./pages/chef/Facturas";
import ConfigChef from "./pages/configuracion/ConfigChef.jsx";
import AdminRestaurante from "./pages/admin/AdminRestaurante.jsx";
import { DetalleGastosMensual } from "./components/shared/DetalleGastosMensual.jsx";
import { GastoForm } from "./components/GastoForm";


import ForgotPage from "./pages/configuracion/ForgotPage.jsx";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPage />} />
      <Route element={<RutaPrivada allowedRoles={["admin", "encargado", "chef"]} />}>
        <Route element={<Layout />}>
          {/* Admin */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/restaurantes" element={<AdminRestaurante />} />
          <Route path="admin/restaurantes/*" element={<AdminRestaurante />} />
          <Route path="admin/crear-restaurante" element={<CrearRestaurante />} />
          <Route path="admin/ventas" element={<AdminVentas />} />
          <Route path="admin/gastos" element={<AdminGastos />} />
          <Route path="admin/usuarios" element={<Usuarios />} />
          <Route path="admin/crear-usuario" element={<CrearUsuario />} />
          <Route path="admin/settings" element={<ConfigAdmin />} />
          <Route path="admin/proveedores" element={<ProveedoresDashboard />} />
          <Route path="admin/proveedores/restaurante/:id" element={<ProveedorRestauranteDetail />} />
          


          {/* Encargado */}
          <Route path="encargado/dashboard" element={<EncargadoDashboard />} />
          <Route path="encargado/registrar-venta" element={<RegistrarVenta />} />
          <Route path="/encargado/gastos/registrar" element={<GastoForm />} />
          <Route path="encargado/proveedores" element={<ProveedoresEncargado />} />
          <Route path="encargado/proveedores/crear" element={<ProveedorForm />} />
          <Route path="encargado/proveedores/editar/:id" element={<ProveedorForm />} /> 
          <Route path="encargado/ventas" element={<EncargadoVentas />} />
          <Route path="encargado/gastos" element={<DetalleGastosMensual />} />
          <Route path="/encargado/settings" element={<ConfigEncargado />} />
          

          {/* Chef */}

          <Route path="chef/dashboard" element={<ChefDashboard />} />
          
          <Route path="chef/facturas" element={<Facturas />} />
          <Route path="/chef/settings" element={<ConfigChef />} />
          <Route path="chef/gastos" element={<DetalleGastosMensual />} />
          <Route path="chef/gastos/registrar" element={<GastoForm />} />
          <Route path="chef/proveedores" element={<ChefProveedores />} />

        </Route>
      </Route>
    </>
  )
);
