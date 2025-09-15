//Basado en un rango de fechas,
export const generarFechasDesdeRango = (rango) => {
   const { from, to } = rango;

   if (!from || !to) return [];

   const fechas = [];
   const actual = new Date(from);

   while (actual <= to) {
      const fechaFormateada = actual.toISOString().split("T")[0]; // YYYY-MM-DD
      fechas.push({
         fecha: fechaFormateada,
         tipo: "gozada", // puedes rellenar luego como "gozada" o "vendida",
         clicks: 1,
      });

      // Avanzar al día siguiente
      actual.setDate(actual.getDate() + 1);
   }

   return fechas;
};
