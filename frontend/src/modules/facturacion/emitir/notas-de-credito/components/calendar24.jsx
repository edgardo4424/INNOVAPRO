import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Helper: parsear la fecha garantizando que "YYYY-MM-DD" se cree en LOCAL midnight
function parseToLocalDate(v) {
  if (!v) return undefined;
  if (v instanceof Date) return isNaN(v.getTime()) ? undefined : v;

  if (typeof v === "string") {
    const ymd = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const y = Number(ymd[1]);
      const m = Number(ymd[2]) - 1;
      const d = Number(ymd[3]);
      return new Date(y, m, d); // evita shifts por timezone
    }
    const d = new Date(v); // intenta parsear ISO con TZ, si viene con hora/offset
    return isNaN(d.getTime()) ? undefined : d;
  }

  return undefined;
}

export function Calendar24({ tipo = "fecha_Pago", setDato, initialDate }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() => parseToLocalDate(initialDate));

  // Mantener la fecha local cuando cambie la cuota (initialDate)
  useEffect(() => {
    const parsed = parseToLocalDate(initialDate);
    // console.log para debug: descomenta si necesitas ver valores
    // console.log("Calendar24 - initialDate:", initialDate, "=> parsed:", parsed);
    setDate(parsed);
  }, [initialDate]);

  const formatDateWithOffset = (d) => {
    if (!d) return "";
    const isoString = d.toISOString().split(".")[0];
    const offsetInMinutes = d.getTimezoneOffset();
    const sign = offsetInMinutes <= 0 ? "+" : "-";
    const hours = Math.abs(Math.floor(offsetInMinutes / 60)).toString().padStart(2, "0");
    const minutes = Math.abs(offsetInMinutes % 60).toString().padStart(2, "0");
    return `${isoString}${sign}${hours}:${minutes}`;
  };

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const formatted = formatDateWithOffset(selectedDate);
    // Ajusta la llave que mandas dependiendo de lo que espera tu actualizarFechaCuota
    setDato({ [tipo]: formatted });
    setOpen(false);
  };

  // key fuerza que el Calendar se remonte cuando cambia la fecha de la cuota
  const calendarKey = date ? date.toISOString() : String(initialDate ?? "no-date");

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={(val) => {
        // Si abrimos y no tenemos date, forzamos parse desde initialDate
        if (val && !date) {
          setDate(parseToLocalDate(initialDate));
        }
        setOpen(val);
      }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between border-1 border-gray-400 font-normal"
          >
            {date ? format(date, "PPP", { locale: es }) : "Seleccione una fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="p-2">
            <Calendar
              key={calendarKey}
              mode="single"
              selected={date}
              defaultMonth={date}
              fromYear={new Date().getFullYear() - 1}
              toYear={new Date().getFullYear() + 10}
              captionLayout="dropdown"
              onSelect={handleDateChange}
              locale={es}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
