import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFacturacion } from "@/context/FacturacionContext";
import { ClipboardPlus, X } from "lucide-react";
import { useState } from "react";
import PagoForm from "../../forms/PagoForm";

export default function ModalPagos() {


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="btn-agregar">
                    <ClipboardPlus />
                    <span className="hidden md:block">Nuevo Pago</span>
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="min-w-3xl flex flex-col gap-4 ">
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                    onClick={closeModal}
                >
                    <X />
                </button>

                {/* 🧾 Encabezado */}
                <AlertDialogHeader>
                    <AlertDialogTitle>Datos del Pago</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa los datos correctamente para crear un Pago.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 📦 Formulario */}
                <PagoForm closeModal={closeModal} />


            </AlertDialogContent>
        </AlertDialog>
    );
}
