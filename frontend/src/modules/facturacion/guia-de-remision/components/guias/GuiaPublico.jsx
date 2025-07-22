import React, { useState } from 'react';
import InfDocumentoForm from '../../forms/InfDocumentoForm';
import DatosDeEmpresaForm from '../../forms/DatosDeEmpresaForm';
import DatosDeClienteForm from '../../forms/DatosDeClienteForm';
import DatosGuiaEnvioPublicoForm from '../../forms/DatosGuiaEnvioPublicoForm';
import EstadoYOtrosDatosForm from '../../forms/EstadoYOtrosDatosForm';
import ChoferPublicoForm from '../../forms/ChoferPublicoForm';
import DetalleProductoForm from '../../forms/DetalleProductoForm';

const GuiaPublico = () => {
    const [formData, setFormData] = useState({
        tipo_Doc: "09",
        serie: "T001",
        correlativo: "1",
        observacion: "PRUEBA DE GUIA",
        fecha_Emision: "2024-02-06T12:34:00-05:00",
        empresa_Ruc: "20609517922",
        cliente_Tipo_Doc: "6",
        cliente_Num_Doc: "20604915351",
        cliente_Razon_Social: "MEN GRAPH S.A.C.",
        cliente_Direccion: "-",
        guia_Envio_Cod_Traslado: "01",
        guia_Envio_Des_Traslado: "VENTA",
        guia_Envio_Mod_Traslado: "01",
        guia_Envio_Peso_Total: 10,
        guia_Envio_Und_Peso_Total: "KGM",
        guia_Envio_Fec_Traslado: "2024-12-31T13:21:12-05:00",
        guia_Envio_Partida_Ubigeo: "150203",
        guia_Envio_Partida_Direccion: "AV. CACEREES 459",
        guia_Envio_Llegada_Ubigeo: "150204",
        guia_Envio_Llegada_Direccion: "AV. LA MARINA 569",
        estado_Documento: "0",
        manual: false,
        id_Base_Dato: "15265",
        chofer: [
            {
                tipo_doc: "6",
                nro_doc: "20000000002",
                nombres: "TRANSPORTES S.A.C",
                nro_mtc: "0001"
            }
        ],
        detalle: [
            {
                unidad: "KGM",
                cantidad: 1.56,
                cod_Producto: "140",
                descripcion: "PRODUCTO 1"
            },
            {
                unidad: "KGM",
                cantidad: 1.56,
                cod_Producto: "126",
                descripcion: "PRODUCTO 2"
            }
        ]
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleChoferChange = (e, index) => {
        const { name, value } = e.target;
        const updatedChoferes = [...formData.chofer];
        updatedChoferes[index] = {
            ...updatedChoferes[index],
            [name]: value
        };
        setFormData(prevData => ({
            ...prevData,
            chofer: updatedChoferes
        }));
    };

    const handleDetalleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDetalle = [...formData.detalle];
        updatedDetalle[index] = {
            ...updatedDetalle[index],
            [name]: value
        };
        setFormData(prevData => ({
            ...prevData,
            detalle: updatedDetalle
        }));
    };

    const addChofer = () => {
        setFormData(prevData => ({
            ...prevData,
            chofer: [...prevData.chofer, { tipo_doc: "", nro_doc: "", nombres: "", nro_mtc: "" }]
        }));
    };

    const addDetalle = () => {
        setFormData(prevData => ({
            ...prevData,
            detalle: [...prevData.detalle, { unidad: "", cantidad: 0, cod_Producto: "", descripcion: "" }]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // You can send the data to your API here
    };

    return (
        <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'> {/* Adjusted padding for better mobile fit */}
            <form onSubmit={handleSubmit} className='bg-white rounded-lg p-6 sm:p-8 border border-gray-300'> {/* Adjusted padding for smaller screens */}

                {/* Sección de Información del Documento */}
                <InfDocumentoForm formData={formData} handleChange={handleChange} />

                {/* Sección de Datos de la Empresa */}
                <DatosDeEmpresaForm />

                {/* Sección de Datos del Cliente */}
                <DatosDeClienteForm />

                {/* Sección de Guía de Envío */}
                <DatosGuiaEnvioPublicoForm />

                {/* Sección de Estado y Otros */}
                <EstadoYOtrosDatosForm />

                {/* Sección de Transportista */}
                <ChoferPublicoForm />

                {/* Sección de Detalle de Productos */}
                <DetalleProductoForm  />

                {/* Botón de Enviar */}
                <div className='flex justify-end'>
                    <button type='submit' className='px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full sm:w-auto text-left'> {/* Full width on mobile, left-aligned text */}
                        Guardar Documento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuiaPublico;