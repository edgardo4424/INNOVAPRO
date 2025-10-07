import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Calendar55({ tipo, Dato, setDato, value }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    value
      ? new Date(value)
      : Dato && Dato[tipo]
        ? new Date(Dato[tipo])
        : undefined,
  );

  // 🔒 calcula hoy (a las 00:00)
  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  // ✅ sincroniza si cambia Dato
  useEffect(() => {
    if (Dato && Dato[tipo]) {
      const nuevaFecha = new Date(Dato[tipo]);
      if (!isNaN(nuevaFecha)) {
        const nf = new Date(nuevaFecha);
        nf.setHours(0, 0, 0, 0);
        // Si es anterior a hoy, forzamos a hoy
        if (nf < today) {
          setDate(today);
        } else {
          setDate(nf);
        }
      }
    }
  }, [Dato, tipo]);

  const formatDateWithOffset = (date) => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

    const hours = pad(offset / 60);
    const minutes = pad(offset % 60);
    const isoString = date.toISOString().split(".")[0]; // sin milisegundos

    return `${isoString}${sign}${hours}:${minutes}`;
  };

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;
    const s = new Date(selectedDate);
    s.setHours(0, 0, 0, 0);
    if (s < today) return; // bloqueo extra: nada antes de hoy
    setDate(s);
    const formatted = formatDateWithOffset(s);
    setDato((prev) => ({ ...prev, [tipo]: formatted }));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between border-1 border-gray-400 font-normal"
          >
            {date ? date.toLocaleDateString() : "Seleccione una fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            // 🚫 Deshabilita todo lo anterior a hoy
            disabled={[{ before: today }]}
            // límite mínimo de navegación = hoy
            fromDate={today}
            defaultMonth={date && date >= today ? date : today}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
