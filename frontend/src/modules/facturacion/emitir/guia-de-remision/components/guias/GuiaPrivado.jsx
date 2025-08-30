import ChoferPrivadoForm from "../../forms/ChoferPrivadoForm";
import DatosGuiaEnvioPrivadoForm from "../../forms/DatosGuiaEnvioPrivadoForm";

const GuiaPrivado = () => {

    return (
        <div className=" overflow-y-auto  ">
            {/* Sección de Guía de Envío */}
            <DatosGuiaEnvioPrivadoForm />

            {/* Sección de Transportista */}
            <ChoferPrivadoForm />
        </div>
    );
};

export default GuiaPrivado;
