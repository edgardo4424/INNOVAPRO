import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpNarrowWideIcon, Box, X } from "lucide-react";
import { useState } from "react";

export default function ModalVistaPrevia({ items, handleSubirDatos }) {


    const [open, setOpen] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">
                    <Box />
                    <span className="hidden md:block">Previzualizacion</span>
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="md:min-w-2xl flex flex-col gap-4 ">
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-3xl cursor-pointer"
                    onClick={closeModal}
                >
                    <X />
                </button>
                <div className="max-h-96 overflow-y-auto p-2">
                    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden ">
                        <thead className="bg-innova-blue text-white">
                            <tr>
                                <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Codigo</th>
                                <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Descripcion</th>
                                <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className={`bg-white border-b border-gray-200`}>
                                    <td className="py-3 px-6 text-xs text-gray-700">{item.cod_Producto}</td>
                                    <td className="py-3 px-6 text-xs text-gray-700">{item.descripcion}</td>
                                    <td className="py-3 px-6 text-xs text-gray-700">{item.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="w-full flex justify-end pt-3">
                        <button
                            onClick={handleSubirDatos}
                            className="flex items-center text-white bg-innova-blue cursor-pointer p-2 rounded-md">
                            <ArrowUpNarrowWideIcon className="size-5" />
                            <span>Subir Datos</span>
                        </button>
                    </div>
                </div>

            </AlertDialogContent>
        </AlertDialog>
    );
}
