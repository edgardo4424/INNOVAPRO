// src/modules/facturacion/routes/BandejaRoutes.js

import { useRoutes } from 'react-router-dom';
import FacturaBoletaForm from '../emitir/factura-boleta/FacturaBoletaForm';
import GuiaRemisionForm from '../emitir/guia-de-remision/GuiaRemisionForm';
import EmitirLayout from '../layout/EmitirLayout';
import Emitir from '../pages/Emitir';

export const bandejaRoutesConfig = [
    {
        // Esta es la ruta raíz de la bandeja
        path: '/',
        element: <EmitirLayout />,
        children: [
            // Estas son las rutas anidadas
            { index: true, element: <Emitir /> },
            { path: 'factura-boleta', element: <FacturaBoletaForm /> },
            { path: 'guia/:tipoGuia', element: <GuiaRemisionForm /> },
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