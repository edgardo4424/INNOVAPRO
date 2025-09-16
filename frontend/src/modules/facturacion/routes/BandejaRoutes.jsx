// src/modules/facturacion/routes/BandejaRoutes.js

import { useRoutes } from "react-router-dom";
import ListaDocumentos from "../bandeja/list-factura-boleta/ListaDocumentos";
import ListaGuiaRemision from "../bandeja/list-guia-remision/ListaGuiaRemision";
import ListaNotas from "../bandeja/list-nota/ListaNotas";
import BandejaLayout from "../layout/BandejaLayout";
import Bandeja from "../pages/Bandeja";
import { BandejaProvider } from "../context/BandejaContext";

export const bandejaRoutesConfig = [
  {
    // Esta es la ruta raíz de la bandeja
    path: "/",
    element: <BandejaLayout />,
    children: [
      // Estas son las rutas anidadas
      { index: true, element: <Bandeja /> },
      {
        path: "factura-boleta",
        element: (
          <BandejaProvider>
            <ListaDocumentos />
          </BandejaProvider>
        ),
      },
      {
        path: "nota-credito-debito",
        element: (
          <BandejaProvider>
            <ListaNotas />
          </BandejaProvider>
        ),
      },
      {
        path: "guia-remision",
        element: (
          <BandejaProvider>
            <ListaGuiaRemision />
          </BandejaProvider>
        ),
      },
    ],
  },
];

const BandejaRoutes = () => {
  const element = useRoutes(bandejaRoutesConfig);
  return element;
};

export default BandejaRoutes;
