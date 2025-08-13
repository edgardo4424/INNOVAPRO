import { validarFormulario } from "@/modules/facturacion/guia-de-remision/utils/validarFormulario";
import facturacionService from "@/modules/facturacion/service/FacturacionService";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
    const [guiaTransporte, setGuiaTransporte] = useState(null);
    const [guiaTransporteValida, setGuiaTransporteValida] = useState(null);

    const [tipoGuia, setTipoGuia] = useState(null);

    const validarPaso = async (paso) => {
        try {
            const { errores, validos, message } = await validarFormulario(tipoGuia, guiaTransporte);

            if (errores && Object.keys(errores).length > 0) {
                setGuiaTransporteValida((prev) => ({
                    ...prev,
                    ...errores,
                }));
            } else {
                setGuiaTransporteValida(null);
            }

            if (!validos && message) {
                toast.error(message);
                return false;
            } else if (validos && message) {
                // Optionally, show a success toast if validation passes
                // toast.success(message);
            }
            return validos;
        } catch (error) {
            toast.error(error.message || "Error al validar la guía de remisión.");
            return false;
        }
    };

    const EmitirGuia = async () => {
        try {
            const { status, succes, message, data } = await facturacionService.enviarGuia(guiaTransporte)
            console.log(status, succes, message, data);
            return { success: true, message, data };
        } catch (error) {
            console.error(error);
            return error;
        }
    }



    return (
        <GuiaTransporteContext.Provider
            value={{
                guiaTransporte,
                setGuiaTransporte,
                guiaTransporteValida,
                setGuiaTransporteValida,
                validarPaso,
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