import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { notaInical } from "../emitir/notas-de-credito/utils/valoresInicialNota";
import filialesService from "../service/FilialesService";
import factilizaService from "../service/FactilizaService";
import facturaService from "../service/FacturaService";

const NotaContext = createContext();

export function NotaProvider({ children }) {
    const [notaCreditoDebito, setNotaCreditoDebito] = useState(notaInical);// ?Datos de guia que abarcan los 3 casos

    const [id_factura, setIdFactura] = useState(null);


    const [filiales, setFiliales] = useState([]);



    // ?? OBTENER TODAS LAS FILIALES

    useEffect(() => {
        const consultarFiliales = async () => {
            const data = await filialesService.ObtenerPiezas();
            if (data.length === 0) {
                toast.error("No se encontraron filiales");
                return;
            }
            setFiliales(data);
        }
        consultarFiliales();
    }, []);




    const validarNota = async () => {

    };

    const EmitirNota = async () => {
        // 1. Iniciar un objeto de resultado para manejar todos los escenarios.
        let result = {
            success: false,
            message: "Error desconocido al emitir la nota",
            data: null,
        };

        try {
            // 2. Intentar enviar la nota a SUNAT
            const { status, success, message, data } = await factilizaService.enviarNota(notaCreditoDebito);

            // 3. Evaluar la respuesta de la API de factilización.
            if (status === 200 && success) {
                // ÉXITO en SUNAT: La nota fue aceptada.

                // a. Formatear la respuesta de SUNAT para el registro en la base de datos.
                const sunat_respuest = {
                    hash: data.hash,
                    cdr_zip: data.sunatResponse.cdrZip,
                    sunat_success: data.sunatResponse.success,
                    cdr_response_id: data.sunatResponse.cdrResponse.id,
                    cdr_response_code: data.sunatResponse.cdrResponse.code,
                    cdr_response_description: data.sunatResponse.cdrResponse.description,
                };

                // b. Preparar el objeto final a registrar.
                const notaEmitida = {
                    ...notaCreditoDebito,
                    sunat_respuesta: sunat_respuest,
                    id_factura: id_factura,
                };

                // c. ¡Ahora sí! Intentar registrar la nota en la base de datos.
                const dbResult = await registrarBaseDatos(notaEmitida);

                // d. Evaluar el resultado del registro en la base de datos.
                if (dbResult.success) {
                    // ÉXITO TOTAL: Se emitió y se registró correctamente.
                    result = {
                        success: true,
                        message: "Nota de crédito/débito emitida y registrada con éxito.",
                        data: notaEmitida,
                    };
                } else {
                    // ÉXITO PARCIAL: Se emitió a SUNAT, pero falló el registro local.
                    result = {
                        success: false,
                        message: "La nota fue emitida a SUNAT, pero no se pudo registrar en la base de datos.",
                        detailed_message: dbResult.mensaje,
                        data: notaEmitida,
                    };
                }
            } else if (status === 200 && !success) {
                // ERROR LÓGICO: La API respondió, pero SUNAT rechazó el documento.
                result = {
                    success: false,
                    message: message,
                    detailed_message: `${data.error.code} - ${data.error.message}` || "Error desconocido al enviar la nota.",
                    data: data,
                };
            } else {
                // ERROR DE SERVICIO: La API no pudo procesar la solicitud.
                result = {
                    success: false,
                    message: message || "Error desconocido en el servicio de emisión.",
                    data: data,
                };
            }
        } catch (error) {
            // ERROR DE RED o EXCEPCIÓN: Fallo de conexión o problema inesperado.
            console.error("Error al enviar la nota:", error);
            if (error.response) {
                result = {
                    success: false,
                    message: error.response.data?.message || error.response.data?.error || "Error al comunicarse con la API.",
                    data: error.response.data,
                };
            } else {
                result = {
                    success: false,
                    message: error.message || "Ocurrió un error inesperado.",
                    data: null,
                };
            }
        } finally {
            // 4. Devolver el resultado final del proceso.
            return result;
        }
    };

    // La función 'registrarBaseDatos' se mantiene como una función separada
    // que es llamada desde 'EmitirNota'
    const registrarBaseDatos = async (documento) => {
        try {
            if (!documento) {
                return { success: false, mensaje: "No se pudo registrar la nota: documento vacío." };
            }

            const { status, success, data } = await toast.promise(
                facturaService.registrarNota(documento),
                {
                    pending: "Registrando nota en la base de datos...",
                    success: "Nota registrada con éxito en la base de datos de INNOVA.",
                    error: "No se pudo registrar la nota.",
                }
            );

            if (status === 201 && success) {
                Limpiar();
            }

            return { status, success, data, mensaje: "Registro completado." };

        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (data?.mensaje) {
                    toast.error(data.mensaje);
                } else {
                    toast.error("Error al registrar la nota en la base de datos.");
                }
                return {
                    success: false,
                    mensaje: data?.mensaje || "Error al registrar la nota.",
                    status: status,
                };
            } else {
                toast.error("Error de red o desconocido.");
                console.error("Error al registrar la nota:", error);
                return {
                    success: false,
                    mensaje: "Ocurrió un error inesperado al registrar la nota.",
                    status: 500,
                };
            }
        }
    };

    return (
        <NotaContext.Provider
            value={{
                filiales,
                notaCreditoDebito,
                setNotaCreditoDebito,
                EmitirNota,
                setIdFactura
            }}
        >
            {children}
        </NotaContext.Provider>
    );
}

export function useNota() {
    return useContext(NotaContext);
}