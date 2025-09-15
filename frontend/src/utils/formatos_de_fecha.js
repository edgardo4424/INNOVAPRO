
//01 Set 2025
const dia_mes_anho= (fecha) =>
   fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
   });

export {
   dia_mes_anho
}