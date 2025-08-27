import { validarFormulario } from "@/modules/facturacion/emitir/guia-de-remision/utils/validarFormulario";
import { guiaInical, ValoresInterno, ValoresPrivado, ValoresPublico } from "@/modules/facturacion/emitir/guia-de-remision/utils/valoresIncialGuia";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
    const [guiaTransporte, setGuiaTransporte] = useState(guiaInical);// ?Datos de guia que abarcan los 3 casos

    const [guiaDatosPrivado, setGuiaDatosPrivado] = useState(ValoresPrivado);
    const [guiaDatosPublico, setGuiaDatosPublico] = useState(ValoresPublico);
    const [guiaDatosInternos, setGuiaDatosInternos] = useState(ValoresInterno);

    const [guiaTransporteValida, setGuiaTransporteValida] = useState(null);

    const [tipoGuia, setTipoGuia] = useState("transporte-privado");

    const validarGuia = async () => {
        try {
            let guiaATrestear = guiaTransporte;
            switch (tipoGuia) {
                case "transporte-privado":
                    guiaATrestear = {
                        ...guiaATrestear,
                        ...guiaDatosPrivado
                    }
                    break;
                case "transporte-publico":
                    guiaATrestear = {
                        ...guiaATrestear,
                        ...guiaDatosPublico
                    }
                    break;
                case "traslado-misma-empresa":
                    guiaATrestear = {
                        ...guiaATrestear,
                        ...guiaDatosInternos
                    }
                    break;
                default:
                    break;
            }
            console.log(guiaATrestear)
            const { errores, validos, message } = await validarFormulario(tipoGuia, guiaATrestear);

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
            let guiaAEmitir = guiaTransporte;
            switch (tipoGuia) {
                case "transporte-privado":
                    guiaAEmitir = {
                        ...guiaAEmitir,
                        ...guiaDatosPrivado
                    }
                    break;
                case "transporte-publico":
                    guiaAEmitir = {
                        ...guiaAEmitir,
                        ...guiaDatosPublico
                    }
                    break;
                case "traslado-misma-empresa":
                    guiaAEmitir = {
                        ...guiaAEmitir,
                        ...guiaDatosInternos
                    }
                    break;
                default:
                    break;
            }
            const { status: status_factiliza, success: succes_factiliza, message: message_factiliza, data: data_factiliza } = await factilizaService.enviarGuia(guiaAEmitir)
            console.log("aeda", status_factiliza, succes_factiliza, message_factiliza, data_factiliza)
            if (succes_factiliza && status_factiliza === 200) {
                let sunat = {
                    hash: data_factiliza.hash ?? null,
                    mensaje: message_factiliza ?? null,
                    cdr_zip: null,
                    sunat_success: data_factiliza.sunatResponse.success,
                    cdr_response_id: data_factiliza.sunatResponse.cdrResponse.id,
                    cdr_response_code: data_factiliza.sunatResponse.cdrResponse.code,
                    cdr_response_description: data_factiliza.sunatResponse.cdrResponse.description,
                };
                const { detalle, chofer, ...guia } = guiaAEmitir;
                let guiaEstructurada = {
                    ...guia,
                    estado: "EMITIDA",
                    body: JSON.stringify(guiaAEmitir),
                }
                let guiaCopia = { guia: guiaEstructurada, sunat_respuesta: sunat, };

                const { status, success, message } = await RegistrarBaseDatos(guiaCopia);

                console.log("lo que debue registrar", status, success, message);

                if (success && status == 201) {
                    return {
                        success: true,
                        message: message || "Guía de remisión emitida y registrada con éxito.",
                        status: 200
                    };
                } else {
                    return {
                        success: false,
                        message: message,
                        data: guiaTransporte,
                        status: 400
                    }
                };
            } else {
                return {
                    success: false,
                    message: message_factiliza,
                    data: data_factiliza,
                    status: status_factiliza
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
            const { status, success, message } = await toast.promise(
                facturaService.registrarGuiaRemision(documento),
                {
                    pending: "Registrando factura en la base de datos...",
                    success: "Factura registrada conxito en la base de datos de INNOVA.",
                    error: `No se pudo registrar la factura`,
                }
            )
            console.log("status", status);
            console.log("success", success);
            console.log("message", message);
            if (status === 201) {
                setGuiaTransporte(guiaInical);
                if (tipoGuia == "transporte-privado") {
                    setGuiaDatosPrivado(ValoresPrivado);
                } else if (tipoGuia == "transporte-publico") {
                    setGuiaDatosPublico(ValoresPublico);
                } else if (tipoGuia == "traslado-misma-empresa") {
                    setGuiaDatosInternos(ValoresInterno);
                }
            }
            return { status, success, message };
        } catch (error) {
            console.log("error", error);
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    toast.error(data.mensaje);
                }
            }
            return { status: 500, success: false, message: error.message };
        }
    }

    return (
        <GuiaTransporteContext.Provider
            value={{
                guiaTransporte,
                setGuiaTransporte,
                guiaTransporteValida,
                setGuiaTransporteValida,
                guiaDatosPrivado,
                setGuiaDatosPrivado,
                guiaDatosPublico,
                setGuiaDatosPublico,
                guiaDatosInternos,
                setGuiaDatosInternos,
                validarGuia,
                tipoGuia,
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