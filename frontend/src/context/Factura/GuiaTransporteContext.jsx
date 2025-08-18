import { validarFormulario } from "@/modules/facturacion/guia-de-remision/utils/validarFormulario";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
    const [guiaTransporte, setGuiaTransporte] = useState(null);
    const [guiaTransporteValida, setGuiaTransporteValida] = useState(null);

    const [tipoGuia, setTipoGuia] = useState(null);

    const validarGuia = async (paso) => {
        try {
            const { errores, validos, message } = await validarFormulario(tipoGuia, guiaTransporte);

            if (!validos) {
                // Encuentra el primer error y lo muestra en un toast
                const primerError = Object.values(errores)[0];
                if (primerError) {
                    toast.error(primerError);
                } else {
                    toast.error("El formulario contiene errores. Revise los campos.");
                }

                // Opcional: Si quieres guardar todos los errores en el estado
                setGuiaTransporteValida(errores);

                return false;
            } else {
                toast.success(message);
                // El formulario es válido
                setGuiaTransporteValida({}); // Limpia los errores del estado si todo es válido
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
            return { success, message, data, status };
        } catch (error) {
            console.error(error);
            return { success: false, message:error.response.data.message, data: null, status: error.response.status };
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