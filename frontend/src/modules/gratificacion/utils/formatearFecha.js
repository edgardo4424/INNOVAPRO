import { parseISO, format } from 'date-fns';

export const formatearFecha = (fechaISO) => {
   if (!fechaISO) return '';

   const fecha = parseISO(fechaISO);
   return format(fecha, 'dd-MM-yyyy');
};
