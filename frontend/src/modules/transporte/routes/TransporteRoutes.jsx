// src/modules/facturacion/routes/BandejaRoutes.jsx

import RoleGuard from "@/routes/rol.guard";
import { Route, Routes } from "react-router-dom";
import TransporteLayout from "../layout/TransporteLayout";
import Choferes from "../pages/Choferes";
import Transportistas from "../pages/Transportistas";
import Vehiculos from "../pages/Vehiculos";

const TransporteRoutes = () => {
  return (
    <Routes>
      <Route element={<TransporteLayout />}>
        {/* Ruta por defecto */}
        <Route index element={<Choferes />} />

        {/* Ruta protegida: Factura/Boleta */}
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Jefa de Almacén",
                "Gerente de administración",
                "Auxiliar de oficina",
              ]}
            />
          }
        >
          <Route path="choferes" element={<Choferes />} />
        </Route>

        {/* Ruta protegida: Guía de Remisión */}
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Jefa de Almacén",
                "Gerente de administración",
                "Auxiliar de oficina",
              ]}
            />
          }
        >
          <Route path="vehiculos" element={<Vehiculos />} />
        </Route>

        {/* Ruta protegida: Nota de Crédito */}
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Jefa de Almacén",
                "Gerente de administración",
                "Auxiliar de oficina",
              ]}
            />
          }
        >
          <Route path="transportistas" element={<Transportistas />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default TransporteRoutes;
