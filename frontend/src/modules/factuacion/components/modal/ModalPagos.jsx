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

    const { factura } = useFacturacion();

    const montoTotalPagos = factura.forma_pago.reduce(
        (total, pago) => total + (parseFloat(pago.monto) || 0),
        0
    );

    const montoTotalFactura = parseFloat(factura.monto_Imp_Venta || 0);
    const pagosCompletos = montoTotalPagos >= montoTotalFactura;


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <div className="flex items-end justify-start">

                <AlertDialogTrigger asChild>
                    <Button className="btn-agregar" disabled={pagosCompletos}>
                        <ClipboardPlus />
                        <span className="hidden md:block">Nuevo Pago</span>
                    </Button>
                </AlertDialogTrigger>

                <div className="w-full  flex py-2 justify-start gap-x-3 px-3 font-semibold ">
                    {
                        pagosCompletos ? (
                            <h2 className="text-green-400">✅ LLegaste a el Monto Total de la Factura</h2>
                        ) : (
                            <h2 className="text-yellow-300">⚠️ No Llegas a el Monto Total de la Factura</h2>
                        )
                    }
                    <h2>{montoTotalFactura.toFixed(2)} / {montoTotalPagos.toFixed(2)}</h2>
                </div>
            </div>
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


{/* <h2>{montoTotalFactura.toFixed(2)} / {montoTotalPagos.toFixed(2)}</h2> */ }