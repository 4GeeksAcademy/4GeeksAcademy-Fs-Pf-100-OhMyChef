import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gastoServices from "../../services/GastoServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { MonedaSimbolo } from "../../services/MonedaSimbolo";

export const DetalleGastosMensual = () => {
  const simbolo = MonedaSimbolo();
  const { store } = useGlobalReducer();
  const user = store.user;
  const navigate = useNavigate();

  const [view, setView] = useState('mensual');

  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [ano, setAno] = useState(hoy.getFullYear());
  const [monthlyData, setMonthlyData] = useState({ datos: {}, proveedores: [], dias: [], totales: {} });

  const [selectedDate, setSelectedDate] = useState(hoy.toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState([]);
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [proveedoresList, setProveedoresList] = useState([]);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!user?.restaurante_id) return;
    gastoServices.getProveedores(user.restaurante_id)
      .then(list => setProveedoresList(list))
      .catch(() => { });
  }, [user]);

  useEffect(() => {
    if (view !== 'mensual' || !user?.restaurante_id) return;
    gastoServices.resumenMensual(mes, ano)
      .then(data => setMonthlyData(data))
      .catch(() => setMensaje("Error al obtener resumen mensual"));
  }, [view, mes, ano]);

  useEffect(() => {
    if (view !== 'diario' || !user?.restaurante_id) return;
    gastoServices.getGastos(user.restaurante_id)
      .then(all => {
        const filtered = all.filter(g => g.fecha === selectedDate);
        setDailyData(filtered);
      })
      .catch(() => setMensaje("Error al obtener gastos diarios"));
  }, [view, selectedDate]);

  const handleMesChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setAno(parseInt(year, 10));
    setMes(parseInt(month, 10));
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleHoy = () => setSelectedDate(new Date().toISOString().split('T')[0]);

  const nombreMes = new Date(ano, mes - 1).toLocaleString("es", { month: "long", year: "numeric" });

  const displayedDaily = dailyData
    .filter(g => !filterProveedor || g.proveedor_id === parseInt(filterProveedor, 10))
    .filter(g => !filterCategoria || g.categoria === filterCategoria);

  return (
    <div className="dashboard-container ps-2 row py-3 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalle de Gastos</h2>
        <button className="btn btn-success" onClick={() => navigate(`/${user.rol}/gastos/registrar`)}>
          + Registrar gasto
        </button>
      </div>

      <div className="btn-group col-12 col-sm-12 col-lg-6 col-xl-5  mb-3">
        <button className={`btn btn-outline-orange ${view === 'mensual' ? 'active' : ''}`} onClick={() => setView('mensual')}>
          Resumen Mensual
        </button>
        <button className={`btn btn-outline-orange ${view === 'diario' ? 'active' : ''}`} onClick={() => setView('diario')}>
          Detalle Diario
        </button>
      </div>

      {mensaje && <div className="alert alert-danger">{mensaje}</div>}

      {view === 'mensual' ? (
        <>
          <div className="mb-3 justify-content-start">
            <div className="d-flex justify-content-start align-items-center mb-3 mt-2">
              <h5 className="text-muted me-4">Mes seleccionado: {nombreMes.toUpperCase()}</h5>
              <input
                type="month"
                className="form-control w-auto"
                value={`${ano}-${String(mes).padStart(2, '0')}`}
                onChange={handleMesChange}
              />
            </div>
            <p className="text-muted small">
              Días del mes incluidos: {monthlyData.dias.join(", ")}
            </p>
          </div>
          <div className="table-responsive ">
            <table className="table table-hover table-bordered table-striped ">
              <thead>
                <tr>
                  <th rowSpan="2">Proveedor</th>
                  <th colSpan={monthlyData.dias.length}>Día del mes</th>
                  <th rowSpan="2">Total</th>
                </tr>
                <tr>
                  {monthlyData.dias.map(d => (<th key={d} title={`Día ${d}`}>{d}</th>))}
                </tr>
              </thead>
              <tbody>
                {monthlyData.proveedores.map(prov => (
                  <tr key={prov}>
                    <td><strong>{prov}</strong></td>
                    {monthlyData.dias.map(d => (
                      <td key={d} className="text-end">
                        {monthlyData.datos[prov]?.[d]?.toFixed(2) || '-'}
                      </td>
                    ))}
                    <td className="text-end fw-bold">{monthlyData.totales[prov]?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
            <label className="me-2">Fecha:</label>
            <input type="date" className="form-control w-auto me-2" value={selectedDate} onChange={handleDateChange} />
            <button className="btn btn-success me-3" onClick={handleHoy}>Hoy</button>

            <label className="me-2">Proveedor:</label>
            <select className="form-select w-auto me-2" value={filterProveedor} onChange={e => setFilterProveedor(e.target.value)}>
              <option value="">Todos</option>
              {proveedoresList.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <label className="me-2">Categoría:</label>
            <select className="form-select w-auto" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}>
              <option value="">Todas</option>
              <option value="alimentos">Alimentos</option>
              <option value="bebidas">Bebidas</option>
              <option value="limpieza">Limpieza</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-striped border">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {displayedDaily.map(g => {
                  const provName = proveedoresList.find(p => p.id === g.proveedor_id)?.nombre || g.proveedor_id;
                  return (
                    <tr key={g.id}>
                      <td>{provName}</td>
                      <td>{g.categoria}</td>
                      <td>{simbolo}{parseFloat(g.monto).toFixed(2)}</td>
                      <td>{g.nota}</td>
                    </tr>
                  );
                })}
                {displayedDaily.length === 0 && (
                  <tr><td colSpan={4} className="text-center">No hay gastos para esta fecha.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
