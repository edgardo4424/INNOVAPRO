// src/modules/facturacion/routes/BandejaRoutes.js

import { useRoutes } from 'react-router-dom';
import ListaDocumentos from '../bandeja/list-factura-boleta/ListaDocumentos';
import BandejaLayout from '../layout/BandejaLayout';
import Bandeja from '../pages/Bandeja';
import ListaGuiaRemision from '../bandeja/list-guia-remision/ListaGuiaRemision';

export const bandejaRoutesConfig = [
    {
        // Esta es la ruta raíz de la bandeja
        path: '/',
        element: <BandejaLayout />,
        children: [
            // Estas son las rutas anidadas
            { index: true, element: <Bandeja /> },
            { path: 'factura-boleta', element: <ListaDocumentos /> },
            // { path: 'nota-credito-debito', element: <ListaNotasCreditoDebito /> },
            { path: 'guia-remision', element: <ListaGuiaRemision /> },
        ]
    }
];

const BandejaRoutes = () => {
    const element = useRoutes(bandejaRoutesConfig);
    return element;
};

export default BandejaRoutes;