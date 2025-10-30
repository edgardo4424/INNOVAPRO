import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Componentes adicionales necesarios de shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Si usa un selector de fecha

const FormNuevaTarea = ({
  pedidoContent,
  setNuevaTareaForm,
  handleCrearTarea,
  isLoading,
}) => {
  const {
    nota,
    estadoPasePedido,
    numeroVersionContrato,
    obra,
    fechaLimite,
    tipoSolicitud,
    prioridad,
  } = pedidoContent.detalles;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaTareaForm({
      ...pedidoContent,
      detalles: {
        ...pedidoContent.detalles,
        [name]: value,
      },
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6 rounded-lg border bg-white p-4 shadow-lg"
    >
      {/* 1. SECCIÓN: DATOS DE LA SOLICITUD Y PRIORIDAD */}
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="tipoSolicitud"
            className="font-semibold text-gray-700"
          >
            * Tipo de Solicitud
          </Label>
          <Select
            name="tipoSolicitud"
            value={tipoSolicitud}
            disabled={isLoading}
            onValueChange={(e) =>
              handleChange({ target: { name: "tipoSolicitud", value: e } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la acción..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nuevo Despiece">Nuevo Despiece</SelectItem>
              <SelectItem value="Validación de Stock">
                Validación de Stock / Material
              </SelectItem>

            </SelectContent>
          </Select>
        </div>


        {/* Referencia de Proyecto/Pedido */}
        <div className="space-y-2">
          <Label htmlFor="ref_pedido" className="font-semibold text-gray-700">
            * Referencia de Proyecto / Pedido
          </Label>
          <Input
            type="text"
            id="ref_pedido"
            value={obra}
            readOnly
            placeholder="Ej: PRJ-2025-001 / P-2025-543"
          />
        </div>
      </div>

      <hr className="my-6" />

      {/* 2. SECCIÓN: DETALLES DE LA TAREA */}
      <div className="space-y-2">
        <Label htmlFor="descripcion" className="font-semibold text-gray-700">
          * Descripción Detallada / Justificación
        </Label>
        <Textarea
          id="descripcion"
          value={nota}
          disabled={isLoading}
          onChange={(e) =>
            handleChange({ target: { name: "nota", value: e.target.value } })
          }
          placeholder="Aqui puedes ser mas especifico en lo que quieres que realize la persona que tome el pase de pedido"
          className="min-h-[120px]"
        />
      </div>

      {/* Campos del Contenido Original */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="estadoPasePedido"
            className="font-semibold text-gray-700"
          >
            Estado Pase Pedido
          </Label>
          <Input
            type="text"
            id="estadoPasePedido"
            value={estadoPasePedido}
            readOnly
            placeholder="Ej: PRJ-2025-001 / P-2025-543"
            className={"uppercase"}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="version_contrato"
            className="font-semibold text-gray-700"
          >
            Versión de Contrato:
          </Label>
          <Input
            type="text"
            value={numeroVersionContrato}
            readOnly
            id="version_contrato"
            placeholder="0021_31"
            className={"uppercase"}
          />
        </div>
      </div>

      {/* BOTÓN DE ENVÍO */}
      <Button
        onClick={handleCrearTarea}
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Cargando..." : "Asignar Tarea a Oficina Técnica"}
      </Button>
    </form>
  );
};

export default FormNuevaTarea;
