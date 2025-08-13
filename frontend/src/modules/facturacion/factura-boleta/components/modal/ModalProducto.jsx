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
import { useEffect, useState } from "react";
import ProductoForm from "../../forms/ProductoForm";
import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";

export default function ModalProducto({open, setOpen}) {

    const { setProductoActual, setEdicionProducto } = useFacturaBoleta();

    const closeModal = () => {
        setEdicionProducto({
            edicion: false,
            index: null
        })
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
                edicion: false
            }
        )
    };

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, []);


    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button className="btn-agregar">
                    <ClipboardPlus />
                    <span className="hidden md:block">Nuevo Producto</span>
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
                    <AlertDialogTitle>Datos del Producto</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Ingresa los datos correctamente para crear un producto.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                

                {/* 📦 Formulario */}
                <ProductoForm closeModal={closeModal}  />


            </AlertDialogContent>
        </AlertDialog>
    );
}
