import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGuiaTransporte } from "@/context/Factura/GuiaTransporteContext";
const DatosDeEmpresaForm = () => {
    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const { empresa_Ruc } = guiaTransporte;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold flex mb-2">
                Datos de la Empresa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="empresa_Ruc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        RUC Empresa
                    </Label>
                    <Input
                        type="number"
                        id="empresa_Ruc"
                        name="empresa_Ruc"
                        value={empresa_Ruc}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosDeEmpresaForm;
