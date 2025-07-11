// hooks/useJornada.js
export const useJornada = (asistencia) => {
   const jornadaPrincipal = asistencia.jornadas[0];
   const tieneSegundaJornada = asistencia.jornadas.length > 1;
   const segundaJornada = asistencia.jornadas[1];

   const puedeAgregarSegundaJornada =
      jornadaPrincipal?.turno === "mañana" && asistencia.estado !== "falto";

   return {
      jornadaPrincipal,
      segundaJornada,
      tieneSegundaJornada,
      puedeAgregarSegundaJornada,
   };
};
