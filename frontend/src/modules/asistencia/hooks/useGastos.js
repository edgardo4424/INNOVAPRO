import { useState } from "react";

export const useGastos = (asistencia, onUpdateGastos) => {
   const [nuevaDescripcion, setNuevaDescripcion] = useState("");
   const [nuevoMonto, setNuevoMonto] = useState("");
   const agregarGasto = () => {
      if (nuevaDescripcion.trim() && nuevoMonto) {
         const nuevoGasto = {
            id: Date.now(),
            descripcion: nuevaDescripcion.trim(),
            monto: Number.parseFloat(nuevoMonto),
         };

         onUpdateGastos([...asistencia.gastos, nuevoGasto]);
         setNuevaDescripcion("");
         setNuevoMonto("");
      }
   };
   const eliminarGasto = (gastoId) => {
      const gastosActualizados = asistencia.gastos.filter(
         (g) => g.id !== gastoId
      );
      onUpdateGastos(gastosActualizados);
   };

   return {
      nuevaDescripcion,
      setNuevaDescripcion,
      nuevoMonto,
      setNuevoMonto,
      agregarGasto,
      eliminarGasto,
   };
};
