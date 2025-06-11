import {
  createBrowserRouter, BrowserRouter as Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Login } from "./components/Login";
import { RutaPrivada } from "./components/RutaPrivada.jsx";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
// import { Restaurantes } from "./pages/admin/Restaurantes";
import { CrearRestaurante } from "./pages/admin/CrearRestaurante";
import { AdminVentas } from "./pages/admin/AdminVentas";
import { AdminGastos } from "./pages/admin/AdminGastos";
import { Usuarios } from "./pages/admin/Usuarios";
import { CrearUsuario } from "./pages/admin/CrearUsuario";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { ProveedoresDashboard } from "./pages/admin/ProveedoresDashboard";
import  ProveedorRestauranteDetail  from "./pages/admin/ProveedorRestauranteDetail";



import { EncargadoDashboard } from "./pages/encargado/EncargadoDashboard";
import { RegistrarVenta } from "./pages/encargado/RegistrarVenta";
import { ReporteVentas } from "./pages/encargado/ReporteVentas";
import { EncargadoSettings } from "./pages/encargado/EncargadoSettings";
import { RegistrarGasto as RegistrarGastoEncargado } from "./pages/encargado/RegistrarGasto";
import { Proveedores as ProveedoresEncargado } from "./pages/encargado/Proveedores";
import { EncargadoVentas } from "./pages/encargado/EncargadoVentas";
import { EncargadoGastos } from "./pages/encargado/EncargadoGastos";

import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { Gastos as ChefGastos } from "./pages/chef/Gastos";
import { Proveedores as ProveedoresChef } from "./pages/chef/Proveedores";
import { Facturas } from "./pages/chef/Facturas";
import { ChefSettings } from "./pages/chef/ChefSettings";
import AdminRestaurante from "./pages/admin/AdminRestaurante.jsx";







export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<RutaPrivada allowedRoles={["admin", "encargado", "chef"]} />}>
        <Route element={<Layout />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/restaurantes" element={<AdminRestaurante />} />
          <Route path="admin/restaurantes/*" element={<AdminRestaurante />} />
          <Route path="admin/crear-restaurante" element={<CrearRestaurante />} />
          <Route path="admin/ventas" element={<AdminVentas />} />
          <Route path="admin/gastos" element={<AdminGastos />} />
          <Route path="admin/usuarios" element={<Usuarios />} />
          <Route path="admin/crear-usuario" element={<CrearUsuario />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/proveedores" element={<ProveedoresDashboard />} />
          <Route path="admin/proveedores/restaurante/:id" element={<ProveedorRestauranteDetail />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />


          <Route path="encargado/dashboard" element={<EncargadoDashboard />} />
          <Route path="encargado/registrar-venta" element={<RegistrarVenta />} />
          <Route path="encargado/reporte-ventas" element={<ReporteVentas />} />
          <Route
            path="encargado/registrar-gasto"
            element={<RegistrarGastoEncargado />}
          />
          <Route
            path="encargado/proveedores"
            element={<ProveedoresEncargado />}
          />
          <Route path="encargado/ventas" element={<EncargadoVentas />} />
          <Route path="encargado/gastos" element={<EncargadoGastos />} />
          <Route path="encargado/settings" element={<EncargadoSettings />} />
          <Route path="chef/dashboard" element={<ChefDashboard />} />
          <Route path="chef/gastos" element={<ChefGastos />} />
          <Route path="chef/proveedores" element={<ProveedoresChef />} />
          <Route path="chef/facturas" element={<Facturas />} />
          <Route path="chef/settings" element={<ChefSettings />} />
        </Route>
      </Route>
    </>
  )
);
