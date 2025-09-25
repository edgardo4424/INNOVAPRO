import { Suspense, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { StockDashboard, CEODashboard } from "../components/RoleDashboards";
import AdminDashboard from "../components/AdminDashboard";

// Mapeo principal por ROL (1ra prioridad)
const DASHBOARD_BY_ROLE = {
  CEO: CEODashboard,
  "Gerente de administración": AdminDashboard,
  Contadora: AdminDashboard,
  "Asistente Facturación": AdminDashboard,
  "Jefa de Almacén": StockDashboard,
  "Jefe de OT": StockDashboard,
  OT: StockDashboard,
  "Técnico Comercial": StockDashboard,
  Administración: AdminDashboard,
};

export default function DashboardHome() {
  const { user } = useAuth();

  const { Component, rol } = useMemo(() => {
    const rawRol = (user?.rol || "").trim();
    const compByRole = DASHBOARD_BY_ROLE[rawRol];
    return { Component: compByRole || StockDashboard, rol: rawRol };
  }, [user?.rol]);

  return (
    <div className="min-h-full flex-1 flex flex-col p-4">
      <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando dashboard…</div>}>
        <Component rol={rol} />
      </Suspense>
    </div>
  );
}