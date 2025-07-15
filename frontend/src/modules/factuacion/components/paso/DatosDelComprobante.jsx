import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturacion } from "@/context/FacturacionContext";
import { motion } from "framer-motion"; // ✅ Importar motion
import { Calendar22 } from "../Calendar22";

const DatosDelComprobante = () => {
    const { factura, setFactura, facturaValida } = useFacturacion();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFactura((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleSelectChange = (value, name) => {
        setFactura((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    return (
        <motion.div
            className="max-h-[80dvh] min-h-[55dvh] md:min-h-[40dvh] overflow-y-auto p-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <form action="" className="w-full  grid grid-cols-2 gap-x-2 gap-y-3">
                {/* Tipo de Operacion */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1 ">
                    <Label>Tipo de Venta</Label>
                    <Select
                        name="tipo_operacion"
                        value={factura.tipo_Operacion}
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Operacion");
                        }}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona un tipo de operación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0101">Venta lnterna</SelectItem>
                            <SelectItem value="0102">Exportación</SelectItem>
                            <SelectItem value="0103">No Domiciliados</SelectItem>
                            <SelectItem value="0104">Venta Interna – Anticipos</SelectItem>
                            <SelectItem value="0105">Venta Itinerante </SelectItem>
                            <SelectItem value="0106">Factura Guía</SelectItem>
                            <SelectItem value="0107">Venta Arroz Pilado</SelectItem>
                            <SelectItem value="0108">
                                Factura - Comprobante de Percepción
                            </SelectItem>
                            <SelectItem value="0110">Factura - Guía remitente</SelectItem>
                            <SelectItem value="0111">Factura - Guía transportista</SelectItem>
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.tipo_Operacion ? "block" : "hidden"
                            }`}
                    >
                        Debes seleccionar el tipo de operación.
                    </span>
                </div>

                {/* Tipo de Documento */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label>Tipo de Documento</Label>
                    <Select
                        value={factura.tipo_Doc}
                        name="tipo_Doc"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Doc");
                        }}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona un tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">FACTURA</SelectItem>
                            <SelectItem value="03">BOLETA</SelectItem>
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.tipo_Doc ? "block" : "hidden"
                            }`}
                    >
                        Debes seleccionar el tipo de documento.
                    </span>
                </div>

                {/* Serie */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label>Serie</Label>
                    <Input
                        handleInputChange
                        type="text"
                        name="serie"
                        placeholder="serie"
                        className={"border-1 border-gray-400"}
                        value={factura.serie || ""}
                        onChange={handleInputChange}
                        disabled
                    />
                    <span
                        className={`text-red-500  text-sm ${facturaValida.serie ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la serie del comprobante.
                    </span>
                </div>

                {/* Correlativo */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label>Correlativo</Label>
                    <Input
                        type="text"
                        name="correlativo"
                        placeholder="correlativo"
                        className={"border-1 border-gray-400"}
                        value={factura.correlativo || ""}
                        onChange={handleInputChange}
                        disabled
                    />
                    <span
                        className={`text-red-500  text-sm ${facturaValida.correlativo ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el correlativo del comprobante.
                    </span>
                </div>

                {/* Tipo de Moneda */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label>Tipo de Moneda</Label>
                    <Select
                        value={factura.tipo_Moneda}
                        name="tipo_Moneda"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Moneda");
                        }}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Que moneda usass" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PEN">SOLES</SelectItem>
                            <SelectItem value="USD">DOLAR</SelectItem>
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.tipo_Moneda ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el tipo de moneda.
                    </span>
                </div>

                {/* Fecha Emision */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label>Fecha Emision</Label>
                    <Calendar22
                        Dato={factura}
                        setDato={setFactura}
                        tipo="fecha_Emision"
                    />
                    <span
                        className={`text-red-500  text-sm ${facturaValida.fecha_Emision ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la fecha de emision.
                    </span>
                </div>

                {/* Ruc de la empresa */}
                <div className="flex flex-col gap-1 col-span-1 ">
                    <Label htmlFor="empresa_Ruc">Ruc de la empresa</Label>
                    <input
                        list="ruc-options"
                        type="text"
                        name="empresa_Ruc"
                        id="empresa_Ruc"
                        placeholder="Ruc de la empresa"
                        className="border border-gray-400 rounded-md px-2 py-1 "
                        value={factura.empresa_Ruc || ""}
                        onChange={handleInputChange}
                    />
                    <datalist id="ruc-options">
                        <option value="20607086215" label="RUC DE PRUEBA" />
                        <option
                            value="20603021933"
                            label="Innova Rental Maquinaria Sac | Grupo Innova"
                        />
                        <option
                            value="20562974998"
                            label="Encofrados Innova S.a.C. | Grupo Innova"
                        />
                        <option
                            value="20602696643"
                            label="Andamios Electricos Innova S.a.C. | Grupo Innova"
                        />
                        <option
                            value="20555389052"
                            label="Indek Andina e.I.R.L | Grupo Innova"
                        />
                        {/* Puedes cargar esto dinámicamente también */}
                    </datalist>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.empresa_Ruc ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el ruc de la empresa.
                    </span>
                </div>
            </form>
        </motion.div>
    );
};

export default DatosDelComprobante;
