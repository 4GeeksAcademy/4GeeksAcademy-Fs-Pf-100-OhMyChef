import { Link } from "react-router-dom";

export const QuickActionsChef = () => {
  const actions = [
    {
      icon: "➕",
      title: "Registrar Gasto",
      subtitle: "Agregar nuevos albaranes",
      link: "/chef/gastos/registrar",
      bg: "bg-danger-subtle"
    },
    {
      icon: "🚚",
      title: "Proveedores",
      subtitle: "Gestionar proveedores",
      link: "/chef/proveedores",
      bg: "bg-warning-subtle"
    },
    {
      icon: "📊",
      title: "Ver Gastos",
      subtitle: "Resumen y detalle",
      link: "/chef/gastos",
      bg: "bg-success-subtle"
    }
  ];

  return (
    <div className="mt-5 text-center">
      <h5 className="mb-4">⚡ Acciones Rápidas</h5>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {actions.map((a, i) => (
          <Link
            to={a.link}
            key={i}
            className="text-decoration-none text-dark"
            style={{ flex: "1 1 200px", maxWidth: "230px" }}
          >
            <div className="card shadow-sm rounded p-3 h-100 text-center hover-shadow">
              <div
                className={`rounded-circle ${a.bg} d-flex align-items-center justify-content-center mx-auto mb-3`}
                style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
              >
                {a.icon}
              </div>
              <h6 className="fw-bold">{a.title}</h6>
              <small className="text-muted">{a.subtitle}</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
