// hooks/useJornada.js
export const useJornada = (asistencia) => {
   const manana=asistencia.jornadas.find((j)=>j.turno==="mañana")||null;
   const tarde=asistencia.jornadas.find((j)=>j.turno==="tarde")||null;
   const jornadaPrincipal = manana?manana:tarde;
   const tieneSegundaJornada = asistencia.jornadas.length > 1;
   const segundaJornada = tarde
   const puedeAgregarSegundaJornada =
      jornadaPrincipal?.turno === "mañana" && asistencia.estado !== "falto";

   return {
      jornadaPrincipal,
      segundaJornada,
      tieneSegundaJornada,
      puedeAgregarSegundaJornada,
   };
};
