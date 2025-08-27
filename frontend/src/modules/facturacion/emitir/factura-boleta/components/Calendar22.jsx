import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
// ...

export function Calendar22({ tipo, Dato, setDato, value }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    value ? new Date(value) : Dato && Dato[tipo] ? new Date(Dato[tipo]) : undefined
  );

  // ✅ Actualiza la fecha local si cambia el valor en Dato
  useEffect(() => {
    if (Dato && Dato[tipo]) {
      const nuevaFecha = new Date(Dato[tipo]);
      if (!isNaN(nuevaFecha)) {
        setDate(nuevaFecha);
      }
    }
  }, [Dato, tipo]);

  const formatDateWithOffset = (date) => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

    const hours = pad(offset / 60);
    const minutes = pad(offset % 60);
    const isoString = date.toISOString().split('.')[0]; // remove milliseconds

    return `${isoString}${sign}${hours}:${minutes}`;
  };

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const formatted = formatDateWithOffset(selectedDate);
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
            className="w-full justify-between font-normal border-1 border-gray-400"
          >
            {date ? date.toLocaleDateString() : "Seleccione una fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => handleDateChange(selectedDate)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

