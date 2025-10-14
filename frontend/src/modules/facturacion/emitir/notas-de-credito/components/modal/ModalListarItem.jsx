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
import ListaDeItem from "../ListaDeItem";

export default function ModalListarItem({ itemActual, setItemActual, formulario, tipo }) {


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">
                    <Box />
                    <span className="hidden md:block">Buscar Item</span>
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

                <ListaDeItem closeModal={closeModal} />

            </AlertDialogContent>
        </AlertDialog>
    );
}
