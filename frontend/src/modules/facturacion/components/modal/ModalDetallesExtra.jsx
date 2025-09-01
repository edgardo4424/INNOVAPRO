import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { ListPlus, X, Trash2 } from "lucide-react";
import { useState } from "react";

// Lista de opciones predefinidas para el detalle
const OPCIONES_DETALLE = [
    "Direccion Detallada Del Origen",
    "Direccion Detallada Del Destino",
    "Detalle del Viaje",
    "Nombre Del Proyecto"
];

export default function ModalDetalleExtra({ open, setOpen }) {

    const { setDetallesExtra } = useFacturaBoleta();
    const [listaDetalles, setListaDetalles] = useState([]);

    const closeModal = () => {
        setOpen(false);
    };

    const addDetalle = () => {
        setListaDetalles([...listaDetalles, { detalle: "", valor: "" }]);
    };

    const removeDetalle = (index) => {
        const nuevaLista = listaDetalles.filter((_, i) => i !== index);
        setListaDetalles(nuevaLista);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const nuevaLista = listaDetalles.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setListaDetalles(nuevaLista);
    };

    const saveChanges = () => {
        setDetallesExtra(listaDetalles);
        closeModal();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 hover:scale-105 hover:bg-blue-600 cursor-pointer">
                    <ListPlus />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="md:min-w-3xl flex flex-col gap-4 p-6">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer"
                    onClick={closeModal}
                    aria-label="Cerrar"
                >
                    <X />
                </button>
                <AlertDialogHeader>
                    <AlertDialogTitle>Datos Extra</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Detalla más campos específicos para tu factura.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4 overflow-y-auto max-h-96 pr-2">
                    {listaDetalles.map((detalle, i) => (
                        <div key={i} className="grid grid-cols-7 gap-4 items-end py-2">
                            <div className="flex flex-col gap-2 col-span-3">
                                <Label htmlFor={`detalle-${i}`}>Detalle</Label>
                                <Input
                                    id={`detalle-${i}`}
                                    type="text"
                                    name="detalle"
                                    list="opciones-detalles-extra" // Aquí se vincula con el datalist
                                    placeholder="Nombre del campo"
                                    value={detalle.detalle}
                                    onChange={(e) => handleInputChange(e, i)}
                                />
                                {/* Datalist con las opciones predefinidas */}
                                <datalist id="opciones-detalles-extra">
                                    {OPCIONES_DETALLE.map((opcion, index) => (
                                        <option key={index} value={opcion} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="flex flex-col gap-2 col-span-3">
                                <Label htmlFor={`valor-${i}`}>Valor</Label>
                                <Input
                                    id={`valor-${i}`}
                                    type="text"
                                    name="valor"
                                    placeholder="Valor del campo"
                                    value={detalle.valor}
                                    onChange={(e) => handleInputChange(e, i)}
                                />
                            </div>
                            <Button
                                className="w-10 h-10 p-0 text-red-500 hover:bg-red-500/10 cursor-pointer bg-white border-2 border-red-400"
                                onClick={() => removeDetalle(i)}
                                aria-label="Eliminar detalle"
                            >
                                <Trash2 className="size-6" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-x-4">
                    <Button
                        className=" bg-blue-500 hover:scale-105 hover:bg-blue-600 cursor-pointer mt-2"
                        onClick={addDetalle}
                    >
                        <ListPlus className="mr-2" /> Agregar Campo
                    </Button>
                    <Button
                        className=" bg-green-500 hover:scale-105 hover:bg-green-600 cursor-pointer mt-2"
                        onClick={saveChanges}
                    >
                        Guardar
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}