import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Adjust path based on your project structure
import { Button } from "@/components/ui/button"; // Adjust path based on your project structure
import facturaService from "../../service/FacturaService";
import { toast } from "sonner";

const ModalEliminarBorrador = ({
    documentoEliminar,
    setModalEliminar,
    setDocumentoEliminar,
    obtenerBorradores,
}) => {
    const handleCancel = () => { 
        setModalEliminar(false);
        setDocumentoEliminar(null);
    };
    const handleDelete = async (e) => {
        e.preventDefault();
        console.log("ddd")
        const { id } = documentoEliminar;
        try {
            const { success, message} = await facturaService.eliminarBorrador(
                id
            );
            if (success) {
                // toast.success(`Borrador ${documentoEliminar.correlativo} eliminado exitosamente.`);
                obtenerBorradores();
                setModalEliminar(false);
                setDocumentoEliminar(null);
            }
        } catch (error) {
            console.error("Error al eliminar el borrador:", error);
            toast.error("No se pudo eliminar el borrador");
        }
    };

    return (
        <Dialog open={setModalEliminar} onOpenChange={setModalEliminar}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        ¿Deseas eliminar este borrador {documentoEliminar.correlativo}?
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. Por favor, confirma si estás
                        seguro.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" className={"hover:scale-105 transition duration-100 cursor-pointer"} onClick={(e) => handleDelete(e)}>
                        Sí, eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalEliminarBorrador;
