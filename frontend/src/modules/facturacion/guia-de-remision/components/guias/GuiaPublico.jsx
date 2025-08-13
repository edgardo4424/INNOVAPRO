import { useState } from 'react';
import ChoferPublicoForm from '../../forms/ChoferPublicoForm';
import DatosDeClienteForm from '../../forms/DatosDeClienteForm';
import DatosDeEmpresaForm from '../../forms/DatosDeEmpresaForm';
import DatosGuiaEnvioPublicoForm from '../../forms/DatosGuiaEnvioPublicoForm';
import DetalleProductoForm from '../../forms/DetalleProductoForm';
import InfDocumentoForm from '../../forms/InfDocumentoForm';
import ModalVisualizarGuiaPublico from '../modal/ModalVisualizarGuiaPublico';

const GuiaPublico = () => {

    return (
        <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'> {/* Adjusted padding for better mobile fit */}
            <form 
                onSubmit={(e) => {e.preventDefault();}}
                className=" shadow-xl border border-gray-400 bg-white  rounded-3xl  p-10  transition-all duration-300 mb-6"
            >
                {/* Sección de Información del Documento */}
                <InfDocumentoForm />

                {/* Sección de Datos de la Empresa */}
                <DatosDeEmpresaForm />

                {/* Sección de Datos del Cliente */}
                <DatosDeClienteForm />

                {/* Sección de Guía de Envío */}
                <DatosGuiaEnvioPublicoForm />

                {/* Sección de Estado y Otros */}
                {/* <EstadoYOtrosDatosForm /> */}

                {/* Sección de Transportista */}
                <ChoferPublicoForm />

                {/* Sección de Detalle de Productos */}
                <DetalleProductoForm />

                {/* Botón de Enviar */}
                <div className="flex justify-between">
                    <div className="flex gap-x-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 cursor-pointer"
                        >
                            Guardar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                    <ModalVisualizarGuiaPublico />
                </div>
            </form>
        </div>
    );
};

export default GuiaPublico;