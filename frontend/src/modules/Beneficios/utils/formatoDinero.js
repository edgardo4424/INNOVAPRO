export const formatoDinero = (v) =>
   Number(v ?? 0).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
   });
