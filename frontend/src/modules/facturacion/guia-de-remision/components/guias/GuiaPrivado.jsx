import { useState } from "react";
import ChoferPrivadoForm from "../../forms/ChoferPrivadoForm";
import DatosDeClienteForm from "../../forms/DatosDeClienteForm";
import DatosDeEmpresaForm from "../../forms/DatosDeEmpresaForm";
import DatosGuiaEnvioPublicoForm from "../../forms/DatosGuiaEnvioPublicoForm";
import DetalleProductoForm from "../../forms/DetalleProductoForm";
import EstadoYOtrosDatosForm from "../../forms/EstadoYOtrosDatosForm";
import InfDocumentoForm from "../../forms/InfDocumentoForm";

const GuiaPrivado = () => {
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
                apellidos: "BENITO CRUZ",
            },
        ],
        detalle: [
            {
                unidad: "KGM",
                cantidad: 1.56,
                cod_Producto: "140",
                descripcion: "PRODUCTO 1",
            },
            {
                unidad: "KGM",
                cantidad: 1.56,
                cod_Producto: "126",
                descripcion: "PRODUCTO 2",
            },
        ],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleChoferChange = (e, index) => {
        const { name, value } = e.target;
        const updatedChoferes = [...formData.chofer];
        updatedChoferes[index] = {
            ...updatedChoferes[index],
            [name]: value,
        };
        setFormData((prevData) => ({
            ...prevData,
            chofer: updatedChoferes,
        }));
    };

    const handleDetalleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDetalle = [...formData.detalle];
        updatedDetalle[index] = {
            ...updatedDetalle[index],
            [name]: value,
        };
        setFormData((prevData) => ({
            ...prevData,
            detalle: updatedDetalle,
        }));
    };

    const addChofer = () => {
        setFormData((prevData) => ({
            ...prevData,
            chofer: [
                ...prevData.chofer,
                {
                    tipo: "",
                    tipo_doc: "",
                    nro_doc: "",
                    licencia: "",
                    nombres: "",
                    apellidos: "",
                },
            ],
        }));
    };

    const addDetalle = () => {
        setFormData((prevData) => ({
            ...prevData,
            detalle: [
                ...prevData.detalle,
                { unidad: "", cantidad: 0, cod_Producto: "", descripcion: "" },
            ],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Aquí puedes enviar los datos a tu API
    };

    return (
        <div className="container mx-auto ">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800"></h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-8 border border-gray-300"
            >
                {/* Sección de Documento Principal */}
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
                <ChoferPrivadoForm />

                {/* Sección de Detalle de Productos */}
                <DetalleProductoForm />

                {/* Botón de Enviar */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        Guardar Documento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuiaPrivado;
