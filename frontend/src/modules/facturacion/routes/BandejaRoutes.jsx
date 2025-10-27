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
      <Route
        element={
          <BandejaProvider>
            <BandejaLayout />
          </BandejaProvider>
        }
      >
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
                "Facturación",
              ]}
            />
          }
        >
          <Route
            path="factura-boleta"
            element={
                <ListaDocumentos />
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
                "Facturación"
              ]}
            />
          }
        >
          <Route
            path="nota-credito-debito"
            element={
                <ListaNotas />
            }
          />
        </Route>
        <Route
          element={
            <RoleGuard
              roles={[
                "CEO",
                "Gerente de administración",
                "Jefa de Almacén",
                "Contadora",
                "Asistente Facturación",
                "Facturación"
              ]}
            />
          }
        >
          <Route
            path="guia-remision"
            element={
                <ListaGuiaRemision />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default BandejaRoutes;
