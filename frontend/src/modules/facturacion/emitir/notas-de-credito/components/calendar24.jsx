import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Adaptar la función para que reciba la fecha directamente
// en lugar de depender de un objeto `Dato`.
export function Calendar24({ tipo, setDato, initialDate }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(initialDate ? new Date(initialDate) : undefined);

    // ✅ Actualiza la fecha local si cambia el valor de la prop `initialDate`
    useEffect(() => {
        if (initialDate) {
            const nuevaFecha = new Date(initialDate);
            if (!isNaN(nuevaFecha.getTime())) {
                setDate(nuevaFecha);
            }
        } else {
            setDate(undefined);
        }
    }, [initialDate]);

    const formatDateWithOffset = (date) => {
        // Lógica para formatear la fecha
        const isoString = date.toISOString().split('.')[0];
        const offsetInMinutes = date.getTimezoneOffset();
        const sign = offsetInMinutes <= 0 ? '+' : '-';
        const hours = Math.abs(Math.floor(offsetInMinutes / 60)).toString().padStart(2, '0');
        const minutes = Math.abs(offsetInMinutes % 60).toString().padStart(2, '0');

        return `${isoString}${sign}${hours}:${minutes}`;
    };

    const handleDateChange = (selectedDate) => {
        if (!selectedDate) return;
        setDate(selectedDate);
        const formatted = formatDateWithOffset(selectedDate);
        setDato({ fecha_Pago: formatted }); // Asumimos que `setDato` actualiza la fecha de la cuota
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
                        {date ? format(date, "PPP", { locale: es }) : "Seleccione una fecha"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        month={date}
                        captionLayout="dropdown"
                        onSelect={handleDateChange}
                        locale={es} // Asegurarse de que el calendario se muestre en español
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}