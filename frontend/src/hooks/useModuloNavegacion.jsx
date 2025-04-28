import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useModuloNavegacion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const modulesByRole = {
    Gerencia: [
      { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
      { name: "Gestión de Filiales de Innova", path: "/gestion-empresas" },
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Productos y Servicios", path: "/gestion-productos-servicios" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Cotizaciones", path: "/cotizaciones" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
    ],
    Ventas: [
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Cotizaciones", path: "/cotizaciones" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Centro de Atención", path: "/centro-atencion" },
    ],
    "Oficina Técnica": [
      { name: "Centro de Atención", path: "/centro-atencion" },
    ],
    // Agrega los demás roles si quieres aquí
  };

  const modules = modulesByRole[user?.rol] || [];
  const currentPath = location.pathname;

  const currentIndex = modules.findIndex((mod) => mod.path === currentPath);

  const moduloAnterior = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const moduloSiguiente = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const irModuloAnterior = () => {
    if (moduloAnterior) {
      navigate(moduloAnterior.path);
    }
  };

  const irModuloSiguiente = () => {
    if (moduloSiguiente) {
      navigate(moduloSiguiente.path);
    }
  };

  const volverInicio = () => {
    navigate("/");
  };

  return {
    moduloAnterior,
    moduloSiguiente,
    irModuloAnterior,
    irModuloSiguiente,
    volverInicio,
  };
}