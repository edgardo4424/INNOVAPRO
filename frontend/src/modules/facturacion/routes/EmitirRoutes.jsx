// src/modules/facturacion/routes/BandejaRoutes.jsx
import RoleGuard from "@/routes/rol.guard";
import { Route, Routes } from "react-router-dom";
import { FacturaBoletaProvider } from "../context/FacturaBoletaContext";
import { GuiaTransporteProvider } from "../context/GuiaTransporteContext";
import { NotaProvider } from "../context/NotaContext";
import EmitirLayout from "../layout/EmitirLayout";
import Emitir from "../pages/Emitir";
import FacturaBoleta from "../pages/FacturaBoleta";
import GuiaRemision from "../pages/GuiaRemision";
import NotaCredito from "../pages/NotaCredito";

const BandejaRoutes = () => {
  return (
    <Routes>
      <Route element={<EmitirLayout />}>
        {/* Ruta por defecto */}
        <Route index element={<Emitir />} />

        {/* Ruta protegida: Factura/Boleta */}
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
            path="factura-boleta"
            element={
              <FacturaBoletaProvider>
                <FacturaBoleta />
              </FacturaBoletaProvider>
            }
          />
        </Route>

        {/* Ruta protegida: Guía de Remisión */}
        <Route
          element={
            <RoleGuard
              roles={["CEO", "Gerente de administración", "Jefa de Almacén"]}
            />
          }
        >
          <Route
            path="guia"
            element={
              <GuiaTransporteProvider>
                <GuiaRemision />
              </GuiaTransporteProvider>
            }
          />
        </Route>

        {/* Ruta protegida: Nota de Crédito */}
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
            path="nota"
            element={
              <NotaProvider>
                <NotaCredito />
              </NotaProvider>
            }
          />
        </Route>

      </Route>
    </Routes>
  );
};

export default BandejaRoutes;
