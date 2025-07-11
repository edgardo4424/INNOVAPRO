import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturacion } from "@/context/FacturacionContext";
import { Calendar22 } from "../components/Calendar22";
const PagoForm = ({ closeModal }) => {
    const { factura, setFactura, pagoActual, setPagoActual } = useFacturacion();

    const { forma_pago: ListaDePago } = factura
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setPagoActual({
            ...pagoActual,
            [name]: value
        });
    };

    const handleSelectChange = (value, name) => {
        setPagoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    }



    const handleAgregar = () => {
        console.log(pagoActual)
        setFactura({
            ...factura,
            forma_pago: [...factura.forma_pago, {
                ...pagoActual,
                cuota: ListaDePago.length ,
            }]
        })

        setPagoActual({});
        closeModal();
    };


    return (
        <div className=" overflow-y-auto  col-span-4 w-full">
            <form
                action=""
                className="w-full  grid grid-cols-4 gap-x-2 gap-y-3  py-8 "
            >
                {/* Unidad */}
                <div className="flex flex-col gap-1 col-span-2">
                    <Label>Metodo de pago</Label>
                    <Select
                        name="tipo"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo");
                        }}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="-Seleccione-" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CONTADO">CONTADO </SelectItem>
                            <SelectItem value="CREDITO">CREDITO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Monto */}
                <div className="flex flex-col gap-1 col-span-2">
                    <Label>Monto</Label>
                    <Input
                        type="number"
                        name="monto"
                        placeholder="monto"
                        className={"border-1 border-gray-400"}
                        value={pagoActual.monto || 0}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Cuota */}
                <div className="flex flex-col gap-1 col-span-2">
                    <Label>Cuotas</Label>
                    <Input
                        type="number"
                        name="cuota"
                        placeholder="cuota"
                        className={"border-1 border-gray-400"}
                        value={ListaDePago.length + 1}
                        // onChange={handleInputChange}
                        disabled
                    />
                </div>

                {/* Fecha Emision */}
                <div className="flex flex-col gap-1 col-span-2">
                    <Label>Fecha Emision</Label>
                    <Calendar22 Dato={pagoActual} setDato={setPagoActual} tipo={"fecha_Pago"} />
                </div>
            </form>
            {/* 🔘 Botones de acción */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={closeModal} className={"hover:bg-red-50 hover:text-red-600 border-2 border-gray-400"}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleAgregar}
                    form="form-producto" className={"bg-blue-600 hover:bg-blue-800"}>
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default PagoForm;
