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
                    {/* <div className="flex gap-x-8">
                        <button
                            // onClick={handleRegister}
                            className="py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 cursor-pointer ">
                            Guardar
                        </button>
                        <button className="py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 cursor-pointer ">
                            Cancelar
                        </button>
                    </div> */}
                    <ModalEmitirNota />
                </div>
            </div>
        </div>

    )
}

export default NotasCreditoForm
