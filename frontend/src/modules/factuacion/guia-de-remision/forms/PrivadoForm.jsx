import React, { useState } from 'react';

const PrivadoForm = () => {
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
        guia_Envio_Mod_Traslado: "02",
        guia_Envio_Peso_Total: 12.5,
        guia_Envio_Und_Peso_Total: "KGM",
        guia_Envio_Fec_Traslado: "2024-12-31T13:21:12-05:00",
        guia_Envio_Vehiculo_Placa: "AXI325",
        guia_Envio_Partida_Ubigeo: "150203",
        guia_Envio_Partida_Direccion: "AV. CACEREES 459",
        guia_Envio_Llegada_Ubigeo: "150204",
        guia_Envio_Llegada_Direccion: "AV. LA MARINA 569",
        estado_Documento: "0",
        manual: false,
        id_Base_Dato: "15265",
        chofer: [
            {
                tipo: "Principal",
                tipo_doc: "1",
                nro_doc: "44004477",
                licencia: "0001122085",
                nombres: "JUAN PEREZ",
                apellidos: "BENITO CRUZ"
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
            chofer: [...prevData.chofer, { tipo: "", tipo_doc: "", nro_doc: "", licencia: "", nombres: "", apellidos: "" }]
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
        // Aquí puedes enviar los datos a tu API
    };

    return (
        <div className='container mx-auto '>
            <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'></h1>
            <form onSubmit={handleSubmit} className='bg-white rounded-lg p-8 border border-gray-300'>

                {/* Sección de Documento Principal */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Información del Documento</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    <div>
                        <label htmlFor='tipo_Doc' className='block text-sm font-medium text-gray-700 text-left mb-1'>Tipo de Documento</label>
                        <input type='text' id='tipo_Doc' name='tipo_Doc' value={formData.tipo_Doc} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='serie' className='block text-sm font-medium text-gray-700 text-left mb-1'>Serie</label>
                        <input type='text' id='serie' name='serie' value={formData.serie} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='correlativo' className='block text-sm font-medium text-gray-700 text-left mb-1'>Correlativo</label>
                        <input type='text' id='correlativo' name='correlativo' value={formData.correlativo} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <label htmlFor='observacion' className='block text-sm font-medium text-gray-700 text-left mb-1'>Observación</label>
                        <textarea id='observacion' name='observacion' value={formData.observacion} onChange={handleChange} rows='3' className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'></textarea>
                    </div>
                    <div>
                        <label htmlFor='fecha_Emision' className='block text-sm font-medium text-gray-700 text-left mb-1'>Fecha de Emisión</label>
                        <input type='datetime-local' id='fecha_Emision' name='fecha_Emision' value={formData.fecha_Emision} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                </div>

                {/* Sección de Empresa */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Datos de la Empresa</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <div>
                        <label htmlFor='empresa_Ruc' className='block text-sm font-medium text-gray-700 text-left mb-1'>RUC Empresa</label>
                        <input type='text' id='empresa_Ruc' name='empresa_Ruc' value={formData.empresa_Ruc} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                </div>

                {/* Sección de Cliente */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Datos del Cliente</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    <div>
                        <label htmlFor='cliente_Tipo_Doc' className='block text-sm font-medium text-gray-700 text-left mb-1'>Tipo Documento Cliente</label>
                        <input type='text' id='cliente_Tipo_Doc' name='cliente_Tipo_Doc' value={formData.cliente_Tipo_Doc} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='cliente_Num_Doc' className='block text-sm font-medium text-gray-700 text-left mb-1'>Número Documento Cliente</label>
                        <input type='text' id='cliente_Num_Doc' name='cliente_Num_Doc' value={formData.cliente_Num_Doc} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='col-span-1 md:col-span-2 lg:col-span-1'>
                        <label htmlFor='cliente_Razon_Social' className='block text-sm font-medium text-gray-700 text-left mb-1'>Razón Social Cliente</label>
                        <input type='text' id='cliente_Razon_Social' name='cliente_Razon_Social' value={formData.cliente_Razon_Social} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                        <label htmlFor='cliente_Direccion' className='block text-sm font-medium text-gray-700 text-left mb-1'>Dirección Cliente</label>
                        <input type='text' id='cliente_Direccion' name='cliente_Direccion' value={formData.cliente_Direccion} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                </div>

                {/* Sección de Guía de Envío */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Datos de la Guía de Envío</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    <div>
                        <label htmlFor='guia_Envio_Cod_Traslado' className='block text-sm font-medium text-gray-700 text-left mb-1'>Código de Traslado</label>
                        <input type='text' id='guia_Envio_Cod_Traslado' name='guia_Envio_Cod_Traslado' value={formData.guia_Envio_Cod_Traslado} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Mod_Traslado' className='block text-sm font-medium text-gray-700 text-left mb-1'>Modalidad de Traslado</label>
                        <input type='text' id='guia_Envio_Mod_Traslado' name='guia_Envio_Mod_Traslado' value={formData.guia_Envio_Mod_Traslado} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Peso_Total' className='block text-sm font-medium text-gray-700 text-left mb-1'>Peso Total</label>
                        <input type='number' id='guia_Envio_Peso_Total' name='guia_Envio_Peso_Total' value={formData.guia_Envio_Peso_Total} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' step="0.01" />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Und_Peso_Total' className='block text-sm font-medium text-gray-700 text-left mb-1'>Unidad de Peso</label>
                        <input type='text' id='guia_Envio_Und_Peso_Total' name='guia_Envio_Und_Peso_Total' value={formData.guia_Envio_Und_Peso_Total} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Fec_Traslado' className='block text-sm font-medium text-gray-700 text-left mb-1'>Fecha de Traslado</label>
                        <input type='datetime-local' id='guia_Envio_Fec_Traslado' name='guia_Envio_Fec_Traslado' value={formData.guia_Envio_Fec_Traslado} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Vehiculo_Placa' className='block text-sm font-medium text-gray-700 text-left mb-1'>Placa del Vehículo</label>
                        <input type='text' id='guia_Envio_Vehiculo_Placa' name='guia_Envio_Vehiculo_Placa' value={formData.guia_Envio_Vehiculo_Placa} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Partida_Ubigeo' className='block text-sm font-medium text-gray-700 text-left mb-1'>Ubigeo de Partida</label>
                        <input type='text' id='guia_Envio_Partida_Ubigeo' name='guia_Envio_Partida_Ubigeo' value={formData.guia_Envio_Partida_Ubigeo} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <label htmlFor='guia_Envio_Partida_Direccion' className='block text-sm font-medium text-gray-700 text-left mb-1'>Dirección de Partida</label>
                        <input type='text' id='guia_Envio_Partida_Direccion' name='guia_Envio_Partida_Direccion' value={formData.guia_Envio_Partida_Direccion} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div>
                        <label htmlFor='guia_Envio_Llegada_Ubigeo' className='block text-sm font-medium text-gray-700 text-left mb-1'>Ubigeo de Llegada</label>
                        <input type='text' id='guia_Envio_Llegada_Ubigeo' name='guia_Envio_Llegada_Ubigeo' value={formData.guia_Envio_Llegada_Ubigeo} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <label htmlFor='guia_Envio_Llegada_Direccion' className='block text-sm font-medium text-gray-700 text-left mb-1'>Dirección de Llegada</label>
                        <input type='text' id='guia_Envio_Llegada_Direccion' name='guia_Envio_Llegada_Direccion' value={formData.guia_Envio_Llegada_Direccion} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                </div>

                {/* Sección de Estado y Otros */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Estado y Otros Datos</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <div>
                        <label htmlFor='estado_Documento' className='block text-sm font-medium text-gray-700 text-left mb-1'>Estado del Documento</label>
                        <input type='text' id='estado_Documento' name='estado_Documento' value={formData.estado_Documento} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    <div className='flex items-center pt-5'>
                        <input type='checkbox' id='manual' name='manual' checked={formData.manual} onChange={handleChange} className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' />
                        <label htmlFor='manual' className='ml-2 block text-sm font-medium text-gray-700'>Manual</label>
                    </div>
                    <div>
                        <label htmlFor='id_Base_Dato' className='block text-sm font-medium text-gray-700 text-left mb-1'>ID Base de Datos</label>
                        <input type='text' id='id_Base_Dato' name='id_Base_Dato' value={formData.id_Base_Dato} onChange={handleChange} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                </div>

                {/* Sección de Choferes */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Datos del Chofer</h2>
                {formData.chofer.map((chofer, index) => (
                    <div key={index} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-6 border border-gray-200 rounded-md'>
                        <div>
                            <label htmlFor={`chofer-${index}-tipo`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Tipo</label>
                            <input type='text' id={`chofer-${index}-tipo`} name='tipo' value={chofer.tipo} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`chofer-${index}-tipo_doc`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Tipo Documento</label>
                            <input type='text' id={`chofer-${index}-tipo_doc`} name='tipo_doc' value={chofer.tipo_doc} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`chofer-${index}-nro_doc`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Número Documento</label>
                            <input type='text' id={`chofer-${index}-nro_doc`} name='nro_doc' value={chofer.nro_doc} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`chofer-${index}-licencia`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Licencia</label>
                            <input type='text' id={`chofer-${index}-licencia`} name='licencia' value={chofer.licencia} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`chofer-${index}-nombres`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Nombres</label>
                            <input type='text' id={`chofer-${index}-nombres`} name='nombres' value={chofer.nombres} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`chofer-${index}-apellidos`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Apellidos</label>
                            <input type='text' id={`chofer-${index}-apellidos`} name='apellidos' value={chofer.apellidos} onChange={(e) => handleChoferChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                    </div>
                ))}
                <div className="flex justify-start mb-8">
                    <button type='button' onClick={addChofer} className='px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                        Agregar Chofer
                    </button>
                </div>


                {/* Sección de Detalle */}
                <h2 className='text-2xl font-semibold mb-6 text-blue-800 border-b pb-2'>Detalle de Productos</h2>
                {formData.detalle.map((item, index) => (
                    <div key={index} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-6 border border-gray-200 rounded-md'>
                        <div>
                            <label htmlFor={`detalle-${index}-unidad`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Unidad</label>
                            <input type='text' id={`detalle-${index}-unidad`} name='unidad' value={item.unidad} onChange={(e) => handleDetalleChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div>
                            <label htmlFor={`detalle-${index}-cantidad`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Cantidad</label>
                            <input type='number' id={`detalle-${index}-cantidad`} name='cantidad' value={item.cantidad} onChange={(e) => handleDetalleChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' step="0.01" />
                        </div>
                        <div>
                            <label htmlFor={`detalle-${index}-cod_Producto`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Código de Producto</label>
                            <input type='text' id={`detalle-${index}-cod_Producto`} name='cod_Producto' value={item.cod_Producto} onChange={(e) => handleDetalleChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                        <div className='col-span-1 md:col-span-2 lg:col-span-1'>
                            <label htmlFor={`detalle-${index}-descripcion`} className='block text-sm font-medium text-gray-700 text-left mb-1'>Descripción</label>
                            <input type='text' id={`detalle-${index}-descripcion`} name='descripcion' value={item.descripcion} onChange={(e) => handleDetalleChange(e, index)} className='px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        </div>
                    </div>
                ))}
                <div className="flex justify-start mb-8">
                    <button type='button' onClick={addDetalle} className='px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                        Agregar Producto
                    </button>
                </div>


                {/* Botón de Enviar */}
                <div className='flex justify-end'>
                    <button type='submit' className='px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'>
                        Guardar Documento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrivadoForm;