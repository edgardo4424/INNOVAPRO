import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const modulesByRole = {
    Gerencia: [
      { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
      { name: "Gestión de Filiales de Innova", path: "/gestion-empresas" },
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
    ],
    Ventas: [
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Centro de Atención", path: "/centro-atencion" },
    ],
    "Oficina Técnica": [
      { name: "Centro de Atención", path: "/centro-atencion" },
    ],
    Almacén: [],
    Administración: [],
    Clientes: [],
  };

  const modules = modulesByRole[user?.rol] || [];

  return (
    <div className="dashboard-widgets">
      {modules.map((module) => (
        <button
          key={module.name}
          className="widget"
          onClick={() => navigate(module.path)}
        >
          {module.name}
        </button>
      ))}
    </div>
  );
}