import { useLocation } from 'react-router-dom';
import FacturaBoletaForm from '../emitir/factura-boleta/FacturaBoletaForm'
import { useEffect } from 'react';
import { useFacturaBoleta } from '../context/FacturaBoletaContext';

const FacturaBoleta = () => {

    const { factura, setFactura, setIdBorrador, setDetraccionActivado, setDetraccion } = useFacturaBoleta();
    const location = useLocation();
    const documento = location.state || {};


    useEffect(() => {
        console.log("documento", documento);
        const PlasmarBorrador = async () => {
            if (documento.length > 0) {
                setFactura(documento[0]);
                setIdBorrador(documento[1].borr_id_delete);
                // if (documento[0].detraccion) {
                //     setDetraccionActivado(true);
                //     setDetraccion(documento[0].detraccion);
                // }
            }
        }
        PlasmarBorrador();
    }, []);

    return (
        <div className=" w-full flex flex-col items-center px-4 md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-6xl ">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                        Generar Factura / Boleta
                    </h2>
                </div>

                <FacturaBoletaForm />
            </div>
        </div>
    )
}

export default FacturaBoleta
