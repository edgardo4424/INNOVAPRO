import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

const DocumentoAfectadoForm = () => {
    return (
        <div className=" p-4 sm:px-6 lg:px-8 ">
            <h2 className="text-2xl font-semibold mb-2 flex">
                Datos del Documento Afectado
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="afectado_Tipo_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Tipo Documento Afectado
                    </Label>
                    <Select
                        name="afectado_Tipo_Doc"
                    // value={afectado_Tipo_Doc}
                    // onValueChange={(e) => {
                    //     handleSelectChange(e, "afectado_Tipo_Doc");
                    // }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">Factura</SelectItem>
                            <SelectItem value="03">Nota de Crédito</SelectItem>
                            <SelectItem value="07">Nota de Débito</SelectItem>
                            <SelectItem value="02">Boleta</SelectItem>
                            <SelectItem value="06">Guía de Remisión</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label
                        htmlFor="afectado_Num_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Número Documento Afectado
                    </Label>
                    <Input
                        type="text"
                        id="afectado_Num_Doc"
                        name="afectado_Num_Doc"
                        // value={afectado_Num_Doc}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <Label
                        htmlFor="motivo_Cod"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Código Motivo
                    </Label>
                    <Select
                        name="motivo_Cod"
                    // value={motivo_Cod}
                    // onValueChange={(e) => {
                    //     handleSelectChange(e, "motivo_Cod");
                    // }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">ANULACION DE LA OPERACION</SelectItem>
                            <SelectItem value="02">ANULACION POR ERRORES EN LA INFORMACION</SelectItem>
                            <SelectItem value="03">CAMBIO DE RUC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Label
                        htmlFor="motivo_Des"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Descripción Motivo
                    </Label>
                    <Textarea
                        type="text"
                        id="motivo_Des"
                        name="motivo_Des"
                        rows="2"
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                    </Textarea>
                </div>
            </div>

        </div>
    )
}

export default DocumentoAfectadoForm
