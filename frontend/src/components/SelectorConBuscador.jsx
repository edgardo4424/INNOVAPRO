import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

/**
 * Componente Selector con buscador reutilizable
 *
 * @param {Array} listado - Opciones disponibles [{ id, ...otrosCampos }]
 * @param {any} value - Valor seleccionado (id o clave única)
 * @param {function} onSelect - Callback al seleccionar (id seleccionado)
 * @param {boolean} disabled - Desactivar el componente
 * @param {boolean} dense - Usar versión compacta
 * @param {function} labelFn - Función que devuelve el texto a mostrar de cada opción
 * @param {string} idField - Campo usado como identificador único (default: "id")
 * @param {string} placeholder - Texto por defecto si no hay selección
 */
export default function SelectorConBuscador({
  listado = [],
  value = "",
  onSelect,
  disabled = false,
  dense = true,
  labelFn = (item) => item?.nombre || "Sin nombre",
  idField = "id",
  placeholder = "Selecciona una opción",
}) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => listado.find((t) => String(t[idField]) === String(value)),
    [listado, value, idField]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={[
            "w-full truncate justify-between",
            dense ? "h-8.5 text-[11px]" : "",
          ].join(" ")}
        >
          {selected ? labelFn(selected) : placeholder}
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[420px]"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Busca aquí..." />
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {listado.map((item) => (
              <CommandItem
                key={item[idField]}
                value={labelFn(item)}
                onSelect={() => {
                  onSelect?.(item[idField]);
                  setOpen(false);
                }}
                className="text-[12px]"
              >
                {labelFn(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
