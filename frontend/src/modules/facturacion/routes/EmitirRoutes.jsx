// src/modules/facturacion/routes/BandejaRoutes.js

import { useRoutes } from 'react-router-dom';
import ListaDocumentos from '../bandeja/list-factura-boleta/ListaDocumentos';
import EmitirLayout from '../layout/EmitirLayout';
import Emitir from '../pages/Emitir';
import FacturaBoleta from '../emitir/factura-boleta/FacturaBoleta';
import GuiaRemision from '../emitir/guia-de-remision/GuiaRemision';

export const bandejaRoutesConfig = [
    {
        // Esta es la ruta raíz de la bandeja
        path: '/',
        element: <EmitirLayout />,
        children: [
            // Estas son las rutas anidadas
            { index: true, element: <Emitir /> },
            { path: 'factura-boleta', element: <FacturaBoleta /> },
            { path: 'guia/:tipoGuia', element: <GuiaRemision /> },
            // { path: 'factura-boleta', element: <ListaDocumentos /> },
            // { path: 'nota-credito-debito', element: <NotasCreditoDebito /> },
        ]
    }
];

const BandejaRoutes = () => {
    const element = useRoutes(bandejaRoutesConfig);
    return element;
};

export default BandejaRoutes;