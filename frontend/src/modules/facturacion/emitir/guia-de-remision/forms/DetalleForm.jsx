import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { useEffect, useState } from "react";
import ExcelUploader from "../components/ExcelUploader";
import ModalProducto from "../components/modal/ModalProducto";
import TablaDetalles from "../components/tabla/TablaDetalles";
import useProducto from "@/modules/facturacion/hooks/useProducto";


const DetalleForm = () => {
    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();
    const { ObtenerProductos } = useProducto();
    const [excelData, setExcelData] = useState(null);
    const [piezasDisponibles, setPiezasDisponibles] = useState([]);
    const [piezasExcel, setPiezasExcel] = useState([]);

    const {
        guia_Envio_Peso_Total,
        guia_Envio_Und_Peso_Total,
    } = guiaTransporte;

    useEffect(() => {
        const cargarPiezas = async () => {
            try {
                const data = await ObtenerProductos();
                setPiezasDisponibles(data);
                console.log(data);
            } catch (error) {
                console.error('Error al cargar piezas', error);
            }
        };
        cargarPiezas();
    }, []);

    const [open, setOpen] = useState(false);

    const handleSelectChange = (value, name) => {
        setGuiaTransporte((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleExcelDataLoaded = (data) => {
        setExcelData(data.data);
        console.log("Datos del Excel cargados:", data);

        // Aquí puedes procesar los datos del Excel como necesites
        if (data && data.data.length > 0) {
            // Ejemplo: agregar los datos al contexto o procesar de alguna manera específica
            // setGuiaTransporte(prev => ({
            //     ...prev,
            //     productosDesdeExcel: data.data
            // }));
        }
    };
    const handleSubirDatos = () => {
        if (!excelData || piezasDisponibles.length === 0) {
            console.error("No hay datos de Excel para procesar o la lista de productos está vacía.");
            return;
        }

        //* Paso 1: Filtrar los datos de Excel para encontrar solo los que existen en 'piezasDisponibles'
        const datosFiltrados = excelData.filter(row => {
            return piezasDisponibles.some(p => p.item === row.cod_Producto);
        });

        //* Paso 2: Usar map para transformar los datos filtrados y agregar el peso calculado
        const datosFormateados = datosFiltrados.map(row => {
            const productoExistente = piezasDisponibles.find(p => p.item === row.cod_Producto);
            let pesoCalculado = parseFloat((Number(productoExistente.peso_kg) * Number(row.cantidad)).toFixed(2));
            return {
                ...row,
                cantidad: pesoCalculado,
            };
        });

        console.log("Datos procesados y formateados:", datosFormateados);
        setGuiaTransporte(prev => ({
            ...prev,
            detalle: datosFormateados
        }));
    };

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <h1 className='text-2xl font-bold py-3'>Detalle de Producto</h1>
            <ModalProducto open={open} setOpen={setOpen} />
            <TablaDetalles open={open} setOpen={setOpen} />
            <div className="flex justify-between px-4 gap-4 py-4 items-start">
                <div className="flex-1">
                    <ExcelUploader onDataLoaded={handleExcelDataLoaded} handleSubirDatos={handleSubirDatos} />

                </div>

                <div className="flex flex-col gap-x-2 gap-y-4 bg-gray-200 rounded-md p-4">
                    <h1 className="text-xl font-bold max-w-[350px] py-2">
                        Selecciona con que Unidad de Peso se trabajara esta Guia
                    </h1>
                    <div className="flex gap-x-4">
                        <Label
                            htmlFor="guia_Envio_Und_Peso_Total"
                            className="min-w-[120px] block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Unidad de Peso
                        </Label>
                        <Select
                            className="!bg-white"
                            name="guia_Envio_Und_Peso_Total"
                            value={guia_Envio_Und_Peso_Total}
                            onValueChange={(e) => {
                                handleSelectChange(e, "guia_Envio_Und_Peso_Total");
                            }}
                        >
                            <SelectTrigger className="w-full border bg-white border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona un unidad de peso" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KGM">KGM - Kilogramo</SelectItem>
                                <SelectItem value="TNE">TNE - Tonelada</SelectItem>
                                <SelectItem value="GRM">GRM - Gramo</SelectItem>
                                <SelectItem value="LBR">LBR - Libra</SelectItem>
                                <SelectItem value="ONZ">ONZ - Onza</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-x-4">
                        <Label
                            htmlFor="guia_Envio_Peso_Total"
                            className="min-w-[120px] block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Peso Total
                        </Label>
                        <Input
                            type="number"
                            id="guia_Envio_Peso_Total"
                            name="guia_Envio_Peso_Total"
                            value={guia_Envio_Peso_Total || ""}
                            className="bg-white px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleForm;