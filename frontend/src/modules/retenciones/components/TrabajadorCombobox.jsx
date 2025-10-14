/* // Combobox para buscar trabajadores de manera dinámica
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { displayTrabajador } from "../utils/ui";

export default function TrabajadorCombobox({ trabajadores, value, onSelect, disabled, dense}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const t = trabajadores?.find(t => Number(t.id) === Number(value));
    return t ? displayTrabajador(t).label : "Seleccionar trabajador";
  }, [trabajadores, value]);

  const handleSelect = (id) => {
    onSelect?.(Number(id));
    setOpen(false);
  };

  // Cierra al cambiar la lista o el valor (defensivo)
  useEffect(() => { setOpen(false); }, [value, trabajadores?.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
            className={[
                "relative flex items-center rounded-md border border-input bg-background",
                "px-2 w-full overflow-hidden",
                dense ? "h-7 text-[11px]" : "h-9 text-sm",
                disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
            ].join(" ")}
            aria-haspopup="listbox"
            aria-expanded="false"
        >
            <span className="truncate pr-5">{selectedLabel}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className={["p-0", dense ? "w-[360px]" : "w-[420px]"].join(" ")} onWheel={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Escribe para buscar trabajador..." className={dense ? "h-8 text-xs" : ""} />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {trabajadores?.map((t) => {
                const label = displayTrabajador(t).label;
                return (
                  <CommandItem key={t.id} value={label} onSelect={() => handleSelect(t.id)}>
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} */

// INNOVA PRO+ v1.1.2 — Combobox de trabajadores (props: trabajadores, value, onSelect, disabled?, dense?)
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

export default function TrabajadorCombobox({
  trabajadores = [],
  value = "",
  onSelect,
  disabled = false,
  dense = true,
}) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => trabajadores.find((t) => String(t.id) === String(value)),
    [trabajadores, value]
  );

  const label = (t) => {
    const dni = t?.numero_documento || t?.dni || "—";
    const nombre =
      t?.nombre_completo ||
      [t?.nombres, t?.apellidos].filter(Boolean).join(" ") ||
      "Sin nombre";
    return `${nombre} — DNI: ${dni}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={["w-full truncate justify-between", dense ? "h-8.5 text-[11px]" : ""].join(" ")}
        >
          {selected ? label(selected) : "Selecciona un trabajador"}
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]"
  onWheel={(e) => e.stopPropagation()} >
        <Command>
          <CommandInput placeholder="Busca por nombre o DNI..." />
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">

            {trabajadores.map((t) => (
              <CommandItem
                key={t.id}
                value={label(t)}
                onSelect={() => {
                  onSelect?.(t.id);
                  setOpen(false);
                }}
                className="text-[12px]"
              >
                {label(t)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}