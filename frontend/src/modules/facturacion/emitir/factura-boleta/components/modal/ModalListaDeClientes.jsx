import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserRoundSearch, X } from "lucide-react";
import { useState } from "react";
import ListaDeCientes from "../ListaDeClientes";

export default function ModalListaDeClientes() {


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                    <UserRoundSearch />
                    <span className="hidden md:block">Buscar Cliente</span>
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
                    <AlertDialogTitle>Bucar Tu Cliente</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa el Nombre
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <ListaDeCientes closeModal={closeModal} />

            </AlertDialogContent>
        </AlertDialog>
    );
}
