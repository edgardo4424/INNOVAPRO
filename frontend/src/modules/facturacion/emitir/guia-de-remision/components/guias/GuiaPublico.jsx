import DatosGuiaEnvioPublicoForm from '../../forms/DatosGuiaEnvioPublicoForm';
import TransportistaPublicoForm from '../../forms/TransportistaPublicoForm';

const GuiaPublico = () => {


    return (
        <>
            {/* Sección de Guía de Envío */}
            <DatosGuiaEnvioPublicoForm />

            {/* Sección de Transportista */}
            <TransportistaPublicoForm />
        </>
    );
};

export default GuiaPublico;