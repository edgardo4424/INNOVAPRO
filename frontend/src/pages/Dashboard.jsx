import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const modulos = [
    { nombre: "Gestion de Usuarios", ruta: "/gestion-usuarios" }, 
    { nombre: "Gestion de Filiales de Innova", ruta: "/gestion-empresas" },
    { nombre: "Gestion de Clientes", ruta: "/gestion-clientes" },
    { nombre: "Gestion de Contactos", ruta: "/gestion-contactos" },
    { nombre: "Gestion de Productos y Servicios", ruta: "/gestion-productos-servicios" },
    { nombre: "Gestion de Obras", ruta: "/gestion-obras" },
    { nombre: "Centro de Atencion", ruta: "/centro-atencion" },
    { nombre: "Registrar Tarea", ruta: "/registrar-tarea" },
    { nombre: "Cotizaciones", ruta: "/cotizaciones" },
]

export default function Dashboard() {
    const navigate = useNavigate();

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
    };

    return (
        <div className="dashboard-main">
            <h1>Bienvenido al sistema de Innova PRO+</h1>
            <p>Selecciona un módulo para comenzar:</p>

            <div className="dashboard-grid">
                {modulos.map((modulo) => (
                    <div key={modulo.nombre} className="dashboard-card">
                        <h3>{modulo.nombre}</h3>
                        <button onClick={() => manejarNavegacion(modulo.ruta)} className="btn-navegar">Entrar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}