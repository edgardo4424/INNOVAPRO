import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ModuloNavegacion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const modulesByRole = {
    Gerencia: [
      { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
      { name: "Gestión de Filiales de Innova", path: "/gestion-empresas" },
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" }
    ],
    Ventas: [
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" }
    ],
    "Oficina Técnica": [
      { name: "Centro de Atención", path: "/centro-atencion" },
    ],
    // Agrega otros roles si aplica
  };

  const modules = modulesByRole[user?.rol] || [];
  const currentPath = location.pathname;
  const currentIndex = modules.findIndex((mod) => mod.path === currentPath);

  const moduloAnterior = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const moduloSiguiente = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const irModuloAnterior = () => {
    if (moduloAnterior) navigate(moduloAnterior.path);
  };

  const irModuloSiguiente = () => {
    if (moduloSiguiente) navigate(moduloSiguiente.path);
  };

  const volverInicio = () => navigate("/");

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
      <button className="back-button" onClick={volverInicio}>
        ⬅ Volver al inicio
      </button>

      {moduloAnterior && (
        <button className="back-button" onClick={irModuloAnterior}>
          ⬅ {moduloAnterior.name}
        </button>
      )}

      {moduloSiguiente && (
        <button className="next-button" onClick={irModuloSiguiente}>
          {moduloSiguiente.name} ➡
        </button>
      )}
    </div>
  );
}