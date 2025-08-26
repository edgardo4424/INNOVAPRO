import FacturaBoletaForm from '../emitir/factura-boleta/FacturaBoletaForm'

const FacturaBoleta = () => {
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
