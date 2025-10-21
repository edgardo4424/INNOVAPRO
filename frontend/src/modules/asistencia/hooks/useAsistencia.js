// hooks/useAsistencia.js
import { useEffect, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import { toast } from "react-toastify";
function esSabado(fechaStr) {
  const [year, month, day] = fechaStr.split("-").map(Number);
  const fecha = new Date(year, month - 1, day); // ← crea fecha en hora local
  return fecha.getDay() === 6;
}

export const useAsistencia = (
  t,
  obtenerTrabajadores,
  date,
  asistenciasSincronizacion = [],
) => {

  const [trabajador,setTrabajador]=useState(t)
  const [asistencia, setAsistencia] = useState({
    trabajador_id: trabajador.id,
    estado_asistencia: "",
    horas_trabajadas: 9,
    minutos_trabajados:0,
    horas_extras: 0,
    fecha: date,
    tarea_realizada_manana:"",
    tarrea_realizada_tarde:"",
    jornadas: [
      {
        id: 2,
        turno: "mañana",
        lugar: "",
        tipo_trabajo_id: null,
      },
    ],
    gastos: [],
  });
  const [isLoading,setIsLoading]=useState(false)
  useEffect(() => {
    if (asistenciasSincronizacion && asistenciasSincronizacion.length > 0) {
      const asistencia_marcate = asistenciasSincronizacion.find(
        (a) => a.trabajador.dni == trabajador.numero_documento,
      );
      if (asistencia_marcate) {
         const payload={...asistencia};         
         const manana=payload.jornadas.find((j)=>j.turno==="mañana")||null;
         const tarde=payload.jornadas.find((j)=>j.turno==="tarde")||null;         
         const m_marcate=asistencia_marcate?.asistencia?.jornada_manhana||null;
         const t_marcate=asistencia_marcate?.asistencia?.jornada_tarde||null;

         if(m_marcate){
            if(manana){
               payload.jornadas=payload.jornadas.map((j)=>{
                  const jor={...j}
                  if(jor.turno==="mañana"){
                     jor.lugar=m_marcate.direccion_obra
                  }
                  return jor;
               })
               payload.tarea_realizada_manana=m_marcate.descripcion_obra;
            }
            else{
              payload.jornadas.push({
                  id: new Date().getTime(),
                  turno: "mañana",
                  lugar: m_marcate.direccion_obra,
                  tipo_trabajo_id: null,
              })
            }
         }
         
         if(t_marcate){
          payload.tarrea_realizada_tarde=t_marcate.descripcion_obra;
          if(tarde){
               payload.jornadas=payload.jornadas.map((j)=>{
                  const jor={...j}
                 
                  if(jor.turno==="tarde"){
                     jor.lugar=t_marcate.direccion_obra
                  }
                  return jor;
               })
            }
            else{
              payload.jornadas.push({
                  id: new Date().getTime(),
                  turno: "tarde",
                  lugar: t_marcate.direccion_obra,
                  tipo_trabajo_id: null,
              })
            }
         }
         payload.estado_asistencia=asistencia_marcate.asistencia.estado;
         const {horas,minutos,segundos}=asistencia_marcate.asistencia.tiempo_trabajado
         
         if(horas){
            payload.horas_trabajadas=esSabado(date)?horas:horas-1;
         }
         if (minutos) {
            payload.minutos_trabajados=minutos;
         }
         if(asistencia_marcate.asistencia.horas_extras){
            payload.horas_extras=asistencia_marcate.asistencia.horas_extras
         }

        setAsistencia(payload);
      }
    }
  }, [asistenciasSincronizacion]);
  const [inputsDeshabilitados, setInputsDeshabilitados] = useState(false);
  useEffect(() => {
    if (trabajador.asistencia) {
      setAsistencia(trabajador.asistencia);
    }
  }, [trabajador.asistencia]);

  const limpiarAsistenciaPorEstado = (estado) => {
    const esValido = ["presente", "tardanza","permiso","teletrabajo"].includes(estado);
    setInputsDeshabilitados(!esValido);

    setAsistencia((prev) => ({
      ...prev,
      estado_asistencia: estado,
      horas_trabajadas: esValido ? 9 : 0,
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
      j.id === jornadaId ? { ...j, [campo]: valor } : j,
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
  // Filtra todas las jornadas excepto la que tenga turno "tarde"
  const jornadasFiltradas = asistencia.jornadas.filter(j => j.turno !== "tarde");
  actualizarAsistencia("jornadas", jornadasFiltradas);
};

  const guardarAsistencia = async () => {
    try {
      setIsLoading(true)
      const response=await asistenciaService.crearAsistenia(asistencia);
      const payload={...t}
      payload.asistencia=response.data.asistencia;
      setTrabajador(payload)
      toast.success("Asistencia guardada corrrectamente");
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
        return;
      }
      toast.error("Hubo un error descocnocido");
    } finally {
      setIsLoading(false)
    }
  };

  const actualizarEstadoAsistencia = async () => {
    try {
      setIsLoading(true)
      const response=await asistenciaService.actualizarAsistencia(asistencia);
      const payload={...t}
      payload.asistencia=response.data.asistencia;
      setTrabajador(payload)
      toast.success("Asistencia Actualizada corrrectamente");
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
        return;
      }
      toast.error("Hubo un error ala actualizar la asistencia");
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const estado = asistencia.estado_asistencia;
    const esEstadoValido = ["presente", "tardanza","permiso","teletrabajo"].includes(estado);

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
    trabajador,
    isLoading
  };
};
