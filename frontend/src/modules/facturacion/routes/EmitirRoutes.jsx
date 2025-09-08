// src/modules/facturacion/routes/BandejaRoutes.js

import { useRoutes } from 'react-router-dom';
import { FacturaBoletaProvider } from '../context/FacturaBoletaContext';
import { GuiaTransporteProvider } from '../context/GuiaTransporteContext';
import { NotaProvider } from '../context/NotaContext';
import EmitirLayout from '../layout/EmitirLayout';
import Emitir from '../pages/Emitir';
import FacturaBoleta from '../pages/FacturaBoleta';
import GuiaRemision from '../pages/GuiaRemision';
import NotaCredito from '../pages/NotaCredito';

export const bandejaRoutesConfig = [
    {
        // Esta es la ruta raíz de la bandeja
        path: '/',
        element: <EmitirLayout />,
        children: [
            // Estas son las rutas anidadas
            { index: true, element: <Emitir /> },
            {
                path: 'factura-boleta',
                element: (
                    <FacturaBoletaProvider>
                        <FacturaBoleta />
                    </FacturaBoletaProvider>
                ),
            },
            {
                path: 'guia',
                element: (
                    <GuiaTransporteProvider>
                        <GuiaRemision />
                    </GuiaTransporteProvider>
                ),
            },
            {
                path: 'nota',
                element: (
                    <NotaProvider>
                        <NotaCredito />
                    </NotaProvider>
                ),
            },
        ]
    }
];

const BandejaRoutes = () => {
    const element = useRoutes(bandejaRoutesConfig);
    return element;
};

export default BandejaRoutes;