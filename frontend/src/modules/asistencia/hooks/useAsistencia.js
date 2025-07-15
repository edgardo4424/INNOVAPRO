// hooks/useAsistencia.js
import { useEffect, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import { toast } from "react-toastify";

export const useAsistencia = (trabajador, obtenerTrabajadores, date) => {
   const [asistencia, setAsistencia] = useState({
      trabajador_id: trabajador.id,
      estado_asistencia: "",
      horas_trabajadas: 8,
      horas_extras: 0,
      fecha: new Date(date).toISOString().slice(0, 10),
      jornadas: [
         {
            id: 1,
            turno: "mañana",
            lugar: "",
            tipo_trabajo_id: null,
         },
      ],
      gastos: [],
   });

   const [inputsDeshabilitados, setInputsDeshabilitados] = useState(false);
   useEffect(() => {
      if (trabajador.asistencia) {
         setAsistencia(trabajador.asistencia);
      }
   }, [trabajador.asistencia]);

   const limpiarAsistenciaPorEstado = (estado) => {
      const esValido = ["presente", "tardanza"].includes(estado);
      setInputsDeshabilitados(!esValido);

      setAsistencia((prev) => ({
         ...prev,
         estado_asistencia: estado,
         horas_trabajadas: esValido?8:0,
         horas_extras: 0,
         jornadas: esValido
            ? [
                 {
                    id: 1,
                    turno: "mañana",
                    lugar: "",
                    tipo_trabajo_id: null,
                 },
              ]
            : [],
         gastos: [],
      }));
   };
   const actualizarAsistencia = (campo, valor) => {
      if (campo === "estado_asistencia") {
         limpiarAsistenciaPorEstado(valor); // ← reemplaza set + efecto
      } else {
         setAsistencia((prev) => ({
            ...prev,
            [campo]: valor,
         }));
      }
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
         tipo_trabajo_id: null,
      };
      actualizarAsistencia("jornadas", [...asistencia.jornadas, nuevaJornada]);
   };

   const eliminarSegundaJornada = () => {
      actualizarAsistencia("jornadas", [asistencia.jornadas[0]]);
   };

   const guardarAsistencia = async () => {
      try {

        await asistenciaService.crearAsistenia(asistencia);
         obtenerTrabajadores();
         toast.success("Asistencia guardada corrrectamente");
      } catch (error) {
         toast.error("Hubo un error al guardar la asistencia");
      }
   };

   // const actualizarEstadoAsistencia = async () => {
   //    console.log(asistencia);
   // };
   const actualizarEstadoAsistencia = async () => {
      try {
         await asistenciaService.actualizarAsistencia(asistencia);
         obtenerTrabajadores();
         toast.success("Asistencia Actualizada corrrectamente");
      } catch (error) {
         console.error(error)
         toast.error("Hubo un error ala actualizar la asistencia");
      }
   };

   useEffect(() => {
      const estado = asistencia.estado_asistencia;
      const esEstadoValido = ["presente", "tardanza"].includes(estado);

      setInputsDeshabilitados(!esEstadoValido);
   }, [asistencia.estado_asistencia]);

   return {
      guardarAsistencia,
      asistencia,
      actualizarAsistencia,
      actualizarJornada,
      agregarSegundaJornada,
      eliminarSegundaJornada,
      inputsDeshabilitados,
      actualizarEstadoAsistencia,
   };
};
