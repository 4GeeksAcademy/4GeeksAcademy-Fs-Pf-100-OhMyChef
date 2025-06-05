import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Login } from "./components/Login";

// Admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Restaurantes } from "./pages/admin/Restaurantes";
import { CrearRestaurante } from "./pages/admin/CrearRestaurante";
import { AdminVentas } from "./pages/admin/AdminVentas";
import { AdminGastos } from "./pages/admin/AdminGastos";
import { Usuarios } from "./pages/admin/Usuarios";
import { CrearUsuario } from "./pages/admin/CrearUsuario";
import { AdminSettings } from "./pages/admin/AdminSettings";

// Encargado
import { EncargadoDashboard } from "./pages/encargado/EncargadoDashboard";
import { RegistrarVenta } from "./pages/encargado/RegistrarVenta";
import { ReporteVentas } from "./pages/encargado/ReporteVentas";
import { EncargadoSettings } from "./pages/encargado/EncargadoSettings";
import { RegistrarGasto as RegistrarGastoEncargado } from "./pages/encargado/RegistrarGasto";
import { Proveedores as ProveedoresEncargado } from "./pages/encargado/Proveedores";
import { EncargadoVentas } from "./pages/encargado/EncargadoVentas"; // NUEVO
import { EncargadoGastos } from "./pages/encargado/EncargadoGastos"; // NUEVO

// Chef
import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { RegistrarGasto as RegistrarGastoChef } from "./pages/chef/RegistrarGasto";
import { Proveedores as ProveedoresChef } from "./pages/chef/Proveedores";
import { Facturas } from "./pages/chef/Facturas";
import { ChefSettings } from "./pages/chef/ChefSettings";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* PRIVADAS */}
      <Route element={<Layout />} errorElement={<h1>Not found!</h1>}>

        {/* ADMIN */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/restaurantes" element={<Restaurantes />} />
        <Route path="admin/crear-restaurante" element={<CrearRestaurante />} />
        <Route path="admin/ventas" element={<AdminVentas />} />
        <Route path="admin/gastos" element={<AdminGastos />} />
        <Route path="admin/usuarios" element={<Usuarios />} />
        <Route path="admin/crear-usuario" element={<CrearUsuario />} />
        <Route path="admin/settings" element={<AdminSettings />} />

        {/* ENCARGADO */}
        <Route path="encargado/dashboard" element={<EncargadoDashboard />} />
        <Route path="encargado/registrar-venta" element={<RegistrarVenta />} />
        <Route path="encargado/reporte-ventas" element={<ReporteVentas />} />
        <Route path="encargado/registrar-gasto" element={<RegistrarGastoEncargado />} />
        <Route path="encargado/proveedores" element={<ProveedoresEncargado />} />
        <Route path="encargado/ventas" element={<EncargadoVentas />} /> {/* NUEVA RUTA */}
        <Route path="encargado/gastos" element={<EncargadoGastos />} /> {/* NUEVA RUTA */}
        <Route path="encargado/settings" element={<EncargadoSettings />} />

        {/* CHEF */}
        <Route path="chef/dashboard" element={<ChefDashboard />} />
        <Route path="chef/registrar-gasto" element={<RegistrarGastoChef />} />
        <Route path="chef/proveedores" element={<ProveedoresChef />} />
        <Route path="chef/facturas" element={<Facturas />} />
        <Route path="chef/settings" element={<ChefSettings />} />
      </Route>
    </>
  )
);
