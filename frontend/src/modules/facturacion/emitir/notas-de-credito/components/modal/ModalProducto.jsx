import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { ClipboardPlus, X } from "lucide-react";
import ItemCambioDescipcion from "../../forms/ItemCambioDescipcion";
import DescuentoGlobalForm from "../../forms/DescuentoGlobalForm";
import DescuentoItemForm from "../../forms/DescuentoItemForm";

const ModalProducto = ({ open, setOpen, closeModal }) => {

    const { notaCreditoDebito } = useNota();

    const { motivo_Cod } = notaCreditoDebito

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 hover:scale-105 hover:bg-blue-600 cursor-pointer">
                    <ClipboardPlus />
                    {
                        motivo_Cod == "03" &&
                        <span className="hidden md:block">Selecciona un item</span>
                    }

                    {/* //? Caso de descuento gobal  */}
                    {
                        motivo_Cod == "04" &&
                        <span className="hidden md:block">Aplicar descuento Global</span>
                    }

                    {/* //? Caso de descuento por item  */}
                    {
                        motivo_Cod == "05" &&
                        <span className="hidden md:block">Aplicar descuento por Item</span>
                    }
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="md:min-w-3xl  flex flex-col gap-4 ">
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer"
                    onClick={closeModal}
                >
                    <X />
                </button>

                {/* 🧾 Encabezado */}
                <AlertDialogHeader >
                    <AlertDialogTitle>Datos a Rellenar</AlertDialogTitle>
                </AlertDialogHeader>


                {/* //?📦 Cambio de descripcion*/}
                {
                    motivo_Cod == "03" &&
                    <ItemCambioDescipcion closeModal={closeModal} />
                }

                {/* //? Caso de descuento gobal  */}
                {
                    motivo_Cod == "04" &&
                    <DescuentoGlobalForm closeModal={closeModal} />
                }

                {/* //? Caso de descuento gobal  */}
                {
                    motivo_Cod == "05" &&
                    <DescuentoItemForm closeModal={closeModal} />
                }

            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalProducto
