import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext"; // Asegúrate de que esta ruta sea correcta

const Paginacion = ({ FormSelect, setFormSelect }) => {
    // Obtenemos la función validarPaso del contexto
    const { validarPaso } = useFacturaBoleta();

    const handlePagination = async (opcion) => {
        // ¡Hacemos la función async!
        if (opcion === "anterior") {
            if (FormSelect === 1) return;
            setFormSelect(FormSelect - 1);
        }

        if (opcion === "siguiente") {
            if (FormSelect === 4) {
                // Si estamos en el último paso (4), la validación es para el envío final,
                // que podría ser manejada por el botón "Facturar"
                // Si quieres que el botón "Siguiente" valide el último paso antes de "desaparecer",
                // podrías añadir:
                // const esValido = await validarPaso("FormaDePago");
                // if (!esValido) return;
                return; // Ya estamos en el último paso, no hay siguiente
            }

            let esValido = true; // Variable para almacenar el resultado de la validación

            // Validar el paso ACTUAL antes de avanzar
            if (FormSelect === 1) {
                esValido = await validarPaso("DatosDelComprobante");
            } else if (FormSelect === 2) {
                esValido = await validarPaso("DatosDelCliente");
            } else if (FormSelect === 3) {
                // ¡Validación para "Monto y Productos" antes de pasar a "Forma de Pago"!
                esValido = await validarPaso("DatosDelProducto");
            }
            // Agrega más else if para otros pasos si los tienes

            if (!esValido) {
                return; // Si no es válido, no avanzamos
            }

            setFormSelect(FormSelect + 1); // Solo avanzamos si la validación es exitosa
        }
    };

    return (
        <div className="w-full flex justify-between items-center px-4">
            {FormSelect !== 1 && (
                <button
                    onClick={() => handlePagination("anterior")}
                    className="py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    Anterior
                </button>
            )}
            {/* Ocupa todo el espacio disponible entre los botones si solo hay uno */}
            {FormSelect === 1 && <div className="flex-grow"></div>}

            {FormSelect !== 4 && (
                <button
                    onClick={() => handlePagination("siguiente")}
                    className="py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    Siguiente
                </button>
            )}
        </div>
    );
};

export default Paginacion;
