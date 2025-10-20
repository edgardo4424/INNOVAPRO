// src/modules/facturacion/routes/BandejaRoutes.jsx
import RoleGuard from "@/routes/rol.guard";
import { Route, Routes } from "react-router-dom";
import PedidosLayout from "../layout/PedidosLayout";
import PedidosTv from "../pages/PedidosTv";
import PasePedidos from "../pages/PasePedidos";

const PedidosRoutes = () => {
  return (
    <Routes>
      <Route element={<PedidosLayout />}>
        {/* Ruta por defecto */}
        <Route index element={<PedidosTv />} />

        {/* Pedidos para tv */}
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Gerente de administración",
                "Contadora",
                "Asistente Facturación",
              ]}
            />
          }
        >
          <Route path="pedidos-tv" element={<PedidosTv />} />
        </Route>

        {/* Pedidos para Emitir */}
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Gerente de administración",
                "Contadora",
                "Asistente Facturación",
              ]}
            />
          }
        >
          <Route path="pase-pedidos" element={<PasePedidos />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default PedidosRoutes;
