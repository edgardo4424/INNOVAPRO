import ModalEmitirNota from './components/modal/ModalEmitirNota'
import DatosDeClienteForm from './forms/DatosDeClienteForm'
import DetallesForm from './forms/DetallesForm'
import DocumentoAfectadoForm from './forms/DocumentoAfectadoForm'
import InfDocumentoForm from './forms/InfDocumentoForm'

const NotasCreditoForm = () => {
    return (

        <div className="container max-w-6xl mx-auto ">
            {/* Form content */}
            <div
                className=" shadow-xl border bg-white border-gray-400  rounded-3xl  p-4  transition-all duration-300 mb-6"
            >
                {/* Sección de Documento Principal */}
                <InfDocumentoForm />

                {/* Seccion de Documento Afectado */}
                <DocumentoAfectadoForm />

                {/*  //? LOS DATOS DEL CLIENTE SE COLOCAN DE MANERA AUTOMATICA AL SELECCIONAR EL DOCUMENTO A AFECTAR*/}
                {/* <DatosDeClienteForm /> */}

                {/* Sección de Detalle de Productos */}
                <DetallesForm />

                <div className="flex justify-end">
                    <ModalEmitirNota />
                </div>
            </div>
        </div>

    )
}

export default NotasCreditoForm
