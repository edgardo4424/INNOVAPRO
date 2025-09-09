import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, X } from "lucide-react";
import ListaDeDocumentosVariables from "../ListaDeDocumentosVariables";

const ModalDocumentos = ({ open, setOpen }) => {

    const closeModal = () => {
        setOpen(false);
    };


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <div className="flex md:items-end justify-start items-start">

                <AlertDialogTrigger asChild>
                    <Button className="bg-innova-blue hover:scale-105 hover:bg-innova-blue-hover cursor-pointer"
                    >
                        <ClipboardPlus />
                        <span className="hidden md:block">Documentos</span>
                    </Button>
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent className="md:min-w-3xl flex flex-col gap-4 ">
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                    onClick={closeModal}
                >
                    <X />
                </button>

                {/* 🧾 Encabezado */}
                <AlertDialogHeader>
                    <AlertDialogTitle>Documentos</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Documento a afectar la Nota de Credito o Debito
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 📦 Lista de documentos */}
                <ListaDeDocumentosVariables closeModal={closeModal} />


            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDocumentos
