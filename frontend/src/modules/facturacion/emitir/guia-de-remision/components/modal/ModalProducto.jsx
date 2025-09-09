import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { Package, X } from "lucide-react";
import DetalleProductoForm from "../../forms/DetalleProductoForm";
import { detalleInicial } from "../../utils/valoresIncialGuia";

export default function ModalProducto({ open, setOpen }) {

    const { setProductoActual } = useGuiaTransporte();

    const closeModal = () => {
        setOpen(false);
        setProductoActual(detalleInicial);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
            onClose={closeModal}
        >
            <div className="flex md:items-end justify-start items-start">

                <AlertDialogTrigger asChild>
                    <Button className="bg-innova-blue rounded-md text-white hover:bg-innova-blue-hover cursor-pointer"
                    // disabled={pagosCompletos}
                    >
                        <Package />
                        <span className="hidden md:block">Nuevo Pago</span>
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
                    <AlertDialogTitle>Datos del Producto</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa los datos agregar un nuevo producto a tu detallado
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 📦 Formulario */}
                <DetalleProductoForm closeModal={closeModal} />


            </AlertDialogContent>
        </AlertDialog>
    );
}
