import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { ClipboardPlus, X } from "lucide-react";
import PagoForm from "../../forms/PagoForm";

export default function ModalPagos({ open, setOpen }) {

    const { factura, retencionActivado, retencion, detraccion } = useFacturaBoleta();

    const montoTotalPagos = factura.forma_pago.reduce(
        (total, pago) => total + (parseFloat(pago.monto) || 0),
        0
    );

    let montoTotalFactura = factura.monto_Imp_Venta;
    
    const pagosCompletos = montoTotalPagos.toFixed(2) >= montoTotalFactura;

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <div className="flex md:items-end justify-start items-start">

                <AlertDialogTrigger asChild>
                    <Button className="bg-innova-blue  cursor-pointer"
                        disabled={pagosCompletos}>
                        <ClipboardPlus />
                        <span className="hidden md:block">Nuevo Pago</span>
                    </Button>
                </AlertDialogTrigger>

                <div className="w-full hidden md:flex py-2 justify-start gap-x-3 text-md flex-col md:flex-row px-3 font-semibold ">
                    {
                        pagosCompletos ? (
                            <h2 className="text-green-400">✅ LLegaste a el Monto Total de la Factura</h2>
                        ) : (
                            <h2 className="text-yellow-300">⚠️ No Llegas a el Monto Total de la Factura</h2>
                        )
                    }
                    <h2>{montoTotalFactura} / {montoTotalPagos}</h2>
                </div>
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
                    <AlertDialogTitle>Datos del Pago</AlertDialogTitle>
                    <AlertDialogDescription className="text-center hidden md:block ">
                        Ingresa los datos correctamente para crear un Pago.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 📦 Formulario */}
                <PagoForm closeModal={closeModal} />


            </AlertDialogContent>
        </AlertDialog>
    );
}
