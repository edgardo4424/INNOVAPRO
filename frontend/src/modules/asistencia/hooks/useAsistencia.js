// hooks/useAsistencia.js
import { useEffect, useState } from "react";

export const useAsistencia = (trabajador) => {
   const [asistencia, setAsistencia] = useState({
      trabajador_id: trabajador.id,
      estado_asistencia: "",
      horas_trabajadas: 8,
      horas_extras: 0,
      jornadas: [
         {
            id: 1,
            turno: "mañana",
            lugar: "",
            tipo_trabajo_id: 1,
         },
      ],
      gastos: [],
   });

   useEffect(() => {
      if (trabajador.asistencia) {
         setAsistencia(trabajador.asistencia);
      }
   }, [trabajador.asistencia]);

   const actualizarAsistencia = (campo, valor) => {
      setAsistencia((prev) => ({
         ...prev,
         [campo]: valor,
      }));
   };

   const actualizarJornada = (jornadaId, campo, valor) => {
      const jornadasActualizadas = asistencia.jornadas.map((j) =>
         j.id === jornadaId ? { ...j, [campo]: valor } : j
      );
      actualizarAsistencia("jornadas", jornadasActualizadas);
   };

   const agregarSegundaJornada = () => {
      const nuevaJornada = {
         id: Date.now(),
         turno: "tarde",
         lugar: "",
         tipo_trabajo_id: 1,
      };
      actualizarAsistencia("jornadas", [...asistencia.jornadas, nuevaJornada]);
   };

   const eliminarSegundaJornada = () => {
      actualizarAsistencia("jornadas", [asistencia.jornadas[0]]);
   };

   return {
      asistencia,
      actualizarAsistencia,
      actualizarJornada,
      agregarSegundaJornada,
      eliminarSegundaJornada,
   };
};
