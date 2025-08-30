import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Box, X } from "lucide-react";
import { useState } from "react";
import ListaDeProductos from "../ListaDeProductos";

export default function ModalListaDeProductos({ itemActual, setItemActual, formulario, tipo }) {


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">
                    <Box />
                    <span className="hidden md:block">Buscar Producto</span>
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="md:min-w-2xl flex flex-col gap-4 ">
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                    onClick={closeModal}
                >
                    <X />
                </button>

                {/* 🧾 Encabezado */}
                <AlertDialogHeader>
                    <AlertDialogTitle>Bucar Tu Producto</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa el Nombre
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <ListaDeProductos
                    closeModal={closeModal}
                    itemActual={itemActual}
                    setItemActual={setItemActual}
                    formulario={formulario}
                    tipo={tipo}
                />

            </AlertDialogContent>
        </AlertDialog>
    );
}
