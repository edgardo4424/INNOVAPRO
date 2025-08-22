import { validarFormulario } from "@/modules/facturacion/emitir/guia-de-remision/utils/validarFormulario";
import { guiaMismaEmpresa, guiaPrivada, guiaPublica } from "@/modules/facturacion/emitir/guia-de-remision/utils/valoresIncialGuia";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
    const [guiaTransporte, setGuiaTransporte] = useState(null);
    const [guiaTransporteValida, setGuiaTransporteValida] = useState(null);

    const [tipoGuia, setTipoGuia] = useState(null);

    const validarGuia = async () => {
        try {
            const { errores, validos, message } = await validarFormulario(tipoGuia, guiaTransporte);

            if (!validos) {
                // *Encuentra el primer error y lo muestra en un toast
                const primerError = Object.values(errores)[0];
                if (primerError) {
                    toast.error(primerError);
                } else {
                    toast.error("El formulario contiene errores. Revise los campos.");
                }

                // *Opcional: Si quieres guardar todos los errores en el estado
                setGuiaTransporteValida(errores);

                return false;
            } else {
                toast.success(message);
                setGuiaTransporteValida(null); // ?Limpia los errores del estado si todo es válido
                return true;
            }

        } catch (error) {
            toast.error(error.message || "Error al validar la guía de remisión.");
            return false;
        }
    };

    const EmitirGuia = async () => {
        try {
            const { status, success, message, data } = await factilizaService.enviarGuia(guiaTransporte)
            console.log(status, success, message, data);
            if (success && status === 200) {
                let sunat = {
                    hash: data.hash,
                    mensaje: message ?? null,
                    cdr_zip: null,
                    sunat_success: data.sunatResponse.success,
                    cdr_response_id: data.sunatResponse.cdrResponse.id,
                    cdr_response_code: data.sunatResponse.cdrResponse.code,
                    cdr_response_description: data.sunatResponse.cdrResponse.description,

                };
                const { detalle, chofer, ...guia } = guiaTransporte;
                let guiaEstructurada = {
                    ...guia,
                    estado: "EMITIDA",
                    body: JSON.stringify(guiaTransporte),
                }
                let guiaCopia = { guia: guiaEstructurada, sunat_respuesta: sunat, };

                const { status, success } = await RegistrarBaseDatos(guiaCopia);

                if (success && status === 201) {
                    return {
                        success: true,
                        message: message || "Guía de remisión emitida y registrada con éxito.",
                        status: 200
                    };
                } else {
                    return {
                        success: false,
                        message: mensaje || "Guía de remisión emitida a SUNAT, pero no se pudo registrar en la base de datos.",
                        data: guiaTransporte,
                        status: 400
                    }
                };
            } else {
                return {
                    success: false,
                    message: message,
                    data: data,
                    status: status
                };
            }
        } catch (error) {
            if (error.response) {
                return {
                    success: false,
                    message: error.response.data?.message || error.response.data?.error || "Error al comunicarse con la API.",
                    data: error.response.data,
                    status: error.response.status
                };
            } else {
                return {
                    success: false,
                    message: error.message || "Ocurrió un error inesperado.",
                    data: null,
                    status: 500
                };
            }
        }
    }

    const RegistrarBaseDatos = async (documento) => {
        try {
            const { status, success } = await toast.promise(
                facturaService.registrarGuiaRemision(documento),
                {
                    pending: "Registrando factura en la base de datos...",
                    success: "Factura registrada conxito en la base de datos de INNOVA.",
                    error: `No se pudo registrar la factura`,
                }
            )
            if (status === 201) {
                if (tipoGuia == "transporte-privado") {
                    setGuiaTransporte(guiaPrivada);
                } else if (tipoGuia == "transporte-publico") {
                    setGuiaTransporte(guiaPublica);
                } else if (tipoGuia == "traslado-misma-empresa") {
                    setGuiaTransporte(guiaMismaEmpresa);
                }
            }
            return { status, success };
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    toast.error(data.mensaje);
                }
            }
            return { status: 500, success: false };
        }
    }

    return (
        <GuiaTransporteContext.Provider
            value={{
                guiaTransporte,
                setGuiaTransporte,
                guiaTransporteValida,
                setGuiaTransporteValida,
                validarGuia,
                setTipoGuia,
                EmitirGuia
            }}
        >
            {children}
        </GuiaTransporteContext.Provider>
    );
}

export function useGuiaTransporte() {
    return useContext(GuiaTransporteContext);
}