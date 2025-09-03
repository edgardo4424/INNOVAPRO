import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, X } from "lucide-react";
import ItemCambioDescipcion from "../../forms/ItemCambioDescipcion";

const ModalProducto = ({ open, setOpen, closeModal }) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 hover:scale-105 hover:bg-blue-600 cursor-pointer">
                    <ClipboardPlus />
                    <span className="hidden md:block">Selecciona un item</span>
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
                    <AlertDialogTitle>Datos del Item</AlertDialogTitle>
                    {/* <AlertDialogDescription className="text-center"> */}
                    {/* Ingresa los datos correctamente para crear un producto. */}
                    {/* </AlertDialogDescription> */}
                </AlertDialogHeader>


                {/* 📦 Cambio de descripcion*/}
                <ItemCambioDescipcion  closeModal={closeModal}/>


            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalProducto
