// utils/formatDate.js

const normalizarFecha = (fecha) => {
   const d = new Date(fecha);
   d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // Corrige desfase UTC/local
   return d;
};

export const formatearFecha = (fechaISO) => {
   if (!fechaISO) return "";

   const fecha = normalizarFecha(fechaISO);
   const opciones = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
   const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

   return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
};
