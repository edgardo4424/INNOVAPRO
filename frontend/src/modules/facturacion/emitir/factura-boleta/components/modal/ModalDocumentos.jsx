import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { ClipboardPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import ModalListaDocumentos from "./ModalListaDocumentos";

const ModalDocumentos = ({ open, setOpen }) => {

    const { factura, setFactura } = useFacturaBoleta();

    const [openModal, setOpenModal] = useState(false);
    const [documentos, setDocumentos] = useState({ tipoDoc: "09", nroDoc: "", });

    const closeModal = () => {
        setOpen(false);
        setDocumentos({ tipoDoc: "09", nroDoc: "", });
    };

    const handleSave = () => {
        setFactura((prev) => ({ ...prev, relDocs: [...prev.relDocs, documentos] }));
        closeModal();
    };

    useEffect(() => {
        closeModal();
    }, [factura.relDocs]);


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <div className="flex md:items-end justify-start items-start">

                <AlertDialogTrigger asChild>
                    <Button className="bg-innova-blue hover:scale-105 hover:bg-innova-blue cursor-pointer"
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
                        Los documentos son opcionales
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-end col-span-2">
                        <ModalListaDocumentos />
                    </div>

                    {/* Tipo de Documento */}
                    <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                        <Label htmlFor="tipo_doc">Tipo de Documento</Label>
                        <Select
                            value={documentos.tipoDoc}
                            name="tipo_Doc"
                            onValueChange={(value) => handleSelectChange(value, "tipo_Doc")}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona un tipo de documento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="09">Guia de remision</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                        {/* Fecha de vencimiento */}
                        <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                            <Label htmlFor="nroDoc">Numero de Documento</Label>
                            <Input
                                type="text"
                                name="nroDoc"
                                id="nroDoc"
                                placeholder="Orden de compra"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={documentos.nroDoc}
                                onChange={(e) => setDocumentos({ ...documentos, nroDoc: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>
                    <div className="col-span-full flex justify-end gap-x-2">
                        <Button
                            onClick={closeModal}
                            className="bg-innova-orange hover:scale-105 hover:bg-innova-orange-hover cursor-pointer">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-innova-blue hover:scale-105 hover:bg-innova-blue-hover cursor-pointer">
                            Guardar
                        </Button>
                    </div>
                </div>


            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDocumentos
