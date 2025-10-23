// src/modules/facturacion/routes/BandejaRoutes.jsx
import RoleGuard from "@/routes/rol.guard";
import { Route, Routes } from "react-router-dom";
import { PedidosProvider } from "../context/PedidosContenxt";
import PedidosLayout from "../layout/PedidosLayout";
import PasePedidos from "../pages/PasePedidos";
import PedidosTv from "../pages/PedidosTv";

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
          <Route
            path="pedidos-tv"
            element={
              <PedidosProvider>
                <PedidosTv />
              </PedidosProvider>
            }
          />
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
                "Técnico Comercial",
              ]}
            />
          }
        >
          <Route
            path="pase-pedidos"
            element={
              <PedidosProvider>
                <PasePedidos />
              </PedidosProvider>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default PedidosRoutes;
