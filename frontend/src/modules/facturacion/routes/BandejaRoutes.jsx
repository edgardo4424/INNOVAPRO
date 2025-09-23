// src/modules/facturacion/routes/BandejaRoutes.jsx

import { Routes, Route } from "react-router-dom";
import ListaDocumentos from "../bandeja/list-factura-boleta/ListaDocumentos";
import ListaGuiaRemision from "../bandeja/list-guia-remision/ListaGuiaRemision";
import ListaNotas from "../bandeja/list-nota/ListaNotas";
import BandejaLayout from "../layout/BandejaLayout";
import Bandeja from "../pages/Bandeja";
import RoleGuard from "@/routes/rol.guard";
import { BandejaProvider } from "../context/BandejaContext";

const BandejaRoutes = () => {
  return (
    <Routes>
      <Route element={<BandejaLayout />}>
        {/* Ruta por defecto */}
        <Route index element={<Bandeja />} />
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Gerente de administración",
                "Asistente Facturación",
                "Contadora",
              ]}
            />
          }
        >
          <Route
            path="factura-boleta"
            element={
              <BandejaProvider>
                <ListaDocumentos />
              </BandejaProvider>
            }
          />
        </Route>

        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Gerente de administración",
                "Asistente Facturación",
                "Contadora",
              ]}
            />
          }
        >
          <Route
            path="nota-credito-debito"
            element={
              <BandejaProvider>
                <ListaNotas />
              </BandejaProvider>
            }
          />
        </Route>
        <Route
          element={
            <RoleGuard
              roles={["CEO", "Gerente de administración", "Jefa de Almacén"]}
            />
          }
        >
          <Route
            path="guia-remision"
            element={
              <BandejaProvider>
                <ListaGuiaRemision />
              </BandejaProvider>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default BandejaRoutes;
