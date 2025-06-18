import { useState } from "react";
import ObraForm from "../forms/ObraForm";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ModalEditarObra({ obra, onSubmit }) {
  const [open, setOpen] = useState(false);

  const handleCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el contenido cierre el modal
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Editar Obra</h2>
            </div>

            <ObraForm
              modo="editar"
              obra={obra}
              closeModal={handleClose}
              handleCancel={handleCancel}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
}
