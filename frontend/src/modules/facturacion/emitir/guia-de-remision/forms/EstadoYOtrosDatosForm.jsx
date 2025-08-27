import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EstadoYOtrosDatosForm = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2 pb-2 flex">
                Estado y Otros Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="estado_Documento"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Estado del Documento
                    </Label>
                    <Input
                        type="text"
                        id="estado_Documento"
                        name="estado_Documento"
                        // value={formData.estado_Documento}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="id_Base_Dato"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        ID Base de Datos
                    </Label>
                    <Input
                        type="text"
                        id="id_Base_Dato"
                        name="id_Base_Dato"
                        // value={formData.id_Base_Dato}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                    />
                </div>
                <div className="flex items-center md:pt-5 gap-x-2 justify-start">
                    {" "}
                    {/* Adjusted padding for better alignment on mobile */}
                    <Input
                        type="checkbox"
                        id="manual"
                        name="manual"
                        // checked={formData.manual}
                        // onChange={handleChange}
                        className="h-5 w-5  text-gray-800 border-gray-400 rounded"
                    />
                    <Label
                        htmlFor="manual"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Manual
                    </Label>
                </div>
            </div>
        </div>
    );
};

export default EstadoYOtrosDatosForm;
