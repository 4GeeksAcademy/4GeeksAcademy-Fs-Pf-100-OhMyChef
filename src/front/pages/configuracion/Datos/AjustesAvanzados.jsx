import React, { useState } from "react";

export const AjustesAvanzados = () => {
  const [logs, setLogs] = useState(false);
  const [debug, setDebug] = useState(false);

  return (
    <div className="card p-4 mb-4">
      <h4>Ajustes avanzados</h4>
      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" id="logs" checked={logs} onChange={() => setLogs(!logs)} />
        <label className="form-check-label" htmlFor="logs">Activar logs del sistema</label>
      </div>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" id="debug" checked={debug} onChange={() => setDebug(!debug)} />
        <label className="form-check-label" htmlFor="debug">Modo debug</label>
      </div>
      <button className="btn bg-orange mt-3">Guardar configuración</button>
    </div>
  );
};
