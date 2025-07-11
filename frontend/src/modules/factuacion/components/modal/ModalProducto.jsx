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
import { useState } from "react";
import ProductoForm from "../../forms/ProductoForm";
import { useFacturacion } from "@/context/FacturacionContext";

export default function ModalProducto() {


    const [open, setOpen] = useState(false);
    const { setProductoActual } = useFacturacion();
    const closeModal = () => {
        setOpen(false);
        setProductoActual(
            {
                unidad: "",
                cantidad: 0,
                cod_Producto: "",
                descripcion: "",
                monto_Valor_Unitario: 0,
                monto_Base_Igv: 0,
                porcentaje_Igv: 18.0,
                igv: 0,
                tip_Afe_Igv: "",
                total_Impuestos: 0,
                monto_Precio_Unitario: 0,
                monto_Valor_Venta: 0,
                factor_Icbper: 0,
            }
        )
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button className="btn-agregar">
                    <ClipboardPlus />
                    <span className="hidden md:block">Nuevo Producto</span>
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
                    <AlertDialogTitle>Datos del Producto</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa los datos correctamente para crear un producto.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 📦 Formulario */}
                <ProductoForm closeModal={closeModal} />


            </AlertDialogContent>
        </AlertDialog>
    );
}
