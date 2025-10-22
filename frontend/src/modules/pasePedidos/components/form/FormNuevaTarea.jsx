import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Componentes adicionales necesarios de shadcn/ui
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Si usa un selector de fecha
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const FormNuevaTarea = ({ pedidoContent, setNuevaTareaForm, pedidoView }) => {
  const { tipoTarea, detalle } = pedidoContent;
  const {
    nota,
    estadoPasePedido,
    numeroVersionContrato,
    obra,
    fechaLimite,
    tipoSolicitud,
    prioridad,
  } = detalle;

  const { filial, nro_contrato, empresa_Ruc, cliente_Razon_Social } =
    pedidoView;

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNuevaTareaForm({
      ...pedidoContent,
      detalle: {
        ...pedidoContent.detalle,
        [name]: value,
      },
    });
  };

  return (
    <form className="space-y-6 rounded-lg border bg-white p-4 shadow-lg">
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
            onValueChange={(e) =>
              handleChange({ target: { name: "tipoSolicitud", value: e } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la acción " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuevo_despiece">Nuevo Despiece</SelectItem>
              <SelectItem value="validacion_stock">
                Validación de Stock / Material
              </SelectItem>
              <SelectItem value="modificacion_plano">
                Modificación de Plano Existente
              </SelectItem>
              <SelectItem value="otro">
                Otro (Especificar en descripción)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label htmlFor="prioridad" className="font-semibold text-gray-700">
            * Prioridad
          </Label>
          <Select
            name="prioridad"
            value={prioridad}
            onValueChange={(e) =>
              handleChange({ target: { name: "prioridad", value: e } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la urgencia..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critica">Alta</SelectItem>
              <SelectItem value="alta">Media</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fecha Límite Requerida */}
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fechaLimite" className="font-semibold text-gray-700">
            Fecha Límite Requerida
          </Label>
          <Input
            type="date"
            id="fechaLimite"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring focus:ring-indigo-500 focus:outline-none"
            value={fechaLimite}
            onChange={(e) =>
              handleChange({
                target: { name: "fechaLimite", value: e.target.value },
              })
            }
          />
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
          />
        </div>
      </div>

      {/* BOTÓN DE ENVÍO */}
      <Button
        type="submit"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
      >
        Asignar Tarea a Oficina Técnica
      </Button>
    </form>
  );
};

export default FormNuevaTarea;
