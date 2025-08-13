import React from 'react';
import { FacturaBoletaProvider } from './Factura/FacturaBoletaContext';
import { GuiaTransporteProvider } from './Factura/GuiaTransporteContext';

const AppProviderFacturacion = ({ children }) => {
  return (
    <FacturaBoletaProvider>
      <GuiaTransporteProvider>
        {children}
      </GuiaTransporteProvider>
    </FacturaBoletaProvider>
  );
};

export default AppProviderFacturacion;