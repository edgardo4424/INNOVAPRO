import ChoferPrivadoForm from "../../forms/ChoferPrivadoForm";
import DatosGuiaEnvioPrivadoForm from "../../forms/DatosGuiaEnvioPrivadoForm";

const GuiaPrivado = () => {

    return (
        <>
            {/* Sección de Guía de Envío */}
            <DatosGuiaEnvioPrivadoForm />

            {/* Sección de Transportista */}
            <ChoferPrivadoForm />
        </>
    );
};

export default GuiaPrivado;
