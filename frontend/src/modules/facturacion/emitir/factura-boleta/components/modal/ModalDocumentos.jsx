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
import { toast } from "react-toastify";

const ModalDocumentos = ({ open, setOpen }) => {
  const { factura, setFactura } = useFacturaBoleta();

  const [openModal, setOpenModal] = useState(false);
  const [documentos, setDocumentos] = useState({ tipoDoc: "09", nroDoc: "" });

  const closeModal = () => {
    setOpen(false);
    setDocumentos({ tipoDoc: "09", nroDoc: "" });
  };

  const handleSave = () => {
    if (!documentos.nroDoc.trim()) return;
    // ? Validar duplicados
    const existe = factura.relDocs.some(
      (doc) =>
        doc.nroDoc.trim().toUpperCase() ===
        documentos.nroDoc.trim().toUpperCase(),
    );

    if (existe) {
      toast.warn("Este número de documento ya fue agregado.");
      return;
    }

    setFactura((prev) => ({
      ...prev,
      relDocs: [
        ...prev.relDocs,
        { ...documentos, nroDoc: documentos.nroDoc.trim().toUpperCase() },
      ],
    }));

    closeModal();
  };

  useEffect(() => {
    closeModal();
  }, [factura.relDocs]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-start justify-start md:items-end">
        <AlertDialogTrigger asChild>
          <Button className="bg-innova-blue hover:bg-innova-blue cursor-pointer hover:scale-105">
            <ClipboardPlus />
            <span className="hidden md:block">Documentos</span>
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent className="flex flex-col gap-4 md:min-w-3xl">
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
          <div className="col-span-2 flex justify-end">
            <ModalListaDocumentos />
          </div>

          {/* Tipo de Documento */}
          <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
            <Label htmlFor="tipo_doc">Tipo de Documento</Label>
            <Select
              value={documentos.tipoDoc}
              name="tipo_Doc"
              onValueChange={(value) => handleSelectChange(value, "tipo_Doc")}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona un tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09">Guia de remision</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
            {/* Fecha de vencimiento */}
            <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
              <Label htmlFor="nroDoc">Numero de Documento</Label>
              <Input
                type="text"
                name="nroDoc"
                id="nroDoc"
                placeholder="EJ: GUIA-123456"
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                value={documentos.nroDoc}
                onChange={(e) =>
                  setDocumentos({
                    ...documentos,
                    nroDoc: e.target.value.toUpperCase(),
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full flex justify-end gap-x-2">
            <Button
              onClick={closeModal}
              className="bg-innova-orange hover:bg-innova-orange-hover cursor-pointer hover:scale-105"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-innova-blue hover:bg-innova-blue-hover cursor-pointer hover:scale-105"
            >
              Guardar
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDocumentos;
