const {
   parseISO,
   addDays,
   differenceInCalendarDays,
   format,
   startOfDay,
   endOfDay,
} = require("date-fns");
const {
   sumarMeses,
   contarDiasLaborablesDelMes,
   contarDiasLaborables,
} = require("../../infraestructure/utils/calculo_vacaciones");
class Vacaciones {
   // Propiedades privadas
   #trabajador_id;
   #fecha_inicio;
   #fecha_termino;
   #dias_tomados;
   #dias_vendidos;
   #dias_usados_tomados;
   #dias_usados_vendidos;
   #observaciones;
   #contratos_laborales;
   #asignacion_familiar;

   constructor({
      trabajador_id,
      fecha_inicio,
      fecha_termino,
      dias_tomados,
      dias_vendidos,
      dias_usados_tomados,
      dias_usados_vendidos,
      observaciones,
      contratos_laborales,
      asignacion_familiar,
      asistenciasXvacaciones,
      estado,
   }) {
      this.#trabajador_id = trabajador_id;
      this.#fecha_inicio = fecha_inicio;
      this.#fecha_termino = fecha_termino;
      this.#dias_tomados = dias_tomados;
      this.#dias_vendidos = dias_vendidos;
      this.#dias_usados_tomados = dias_usados_tomados;
      this.#dias_usados_vendidos = dias_usados_vendidos;
      this.#observaciones = observaciones;
      this.#contratos_laborales = contratos_laborales;
      this.asignacion_familiar = asignacion_familiar;
      this.asistenciasXvacaciones = asistenciasXvacaciones;
      this.estado = estado;
   }

   validarCampos() {
      const errores = [];
      this.asistenciasXvacaciones.sort(
         (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );
      if (!this.#trabajador_id) errores.push("No existe el trabajador.");
      const estadosPermitidos = ["pendiente", "aprobada", "rechazada"];
      if (!estadosPermitidos.includes(this.estado)) {
         errores.push(
            `El estado "${this.estado}" no es válido. Debe ser 'gozada' o 'vendida'.`
         );
      }
      if (
         !Array.isArray(this.#contratos_laborales) ||
         this.#contratos_laborales.length === 0
      ) {
         errores.push("No se han proporcionado contratos laborales.");
         return errores;
      }
      if (this.asistenciasXvacaciones[0].fecha != this.#fecha_inicio) {
         errores.push(
            "La fecha de incio no coindide con la primera fecha de vacaciones."
         );
         return errores;
      }
      if (
         this.asistenciasXvacaciones[this.asistenciasXvacaciones.length - 1]
            .fecha != this.#fecha_termino
      ) {
         errores.push(
            "La fecha de termino no coindide con la ultima fecha de vacaciones."
         );
         return errores;
      }

      const fechaVacInicio = parseISO(this.#fecha_inicio);
      const fechaVacFin = endOfDay(parseISO(this.#fecha_termino));
      const hoy = startOfDay(new Date());
      console.log("Inicio:", format(fechaVacInicio, "yyyy-MM-dd"));
      console.log("Fin:   ", format(fechaVacFin, "yyyy-MM-dd"));
      console.log("Hoy:   ", format(hoy, "yyyy-MM-dd"));

      if (fechaVacFin < fechaVacInicio) {
         errores.push(
            "La fecha de término no puede ser anterior a la fecha de inicio."
         );
         return errores;
      }

      const diffEnDias =
         differenceInCalendarDays(fechaVacFin, fechaVacInicio) + 1;
      //Aca se ests cambiando la validadcion de esto--v
      // diffEnDias !== this.#dias_tomados + this.#dias_vendidos
      // A esto---v
      if (diffEnDias < this.#dias_tomados + this.#dias_vendidos) {
         errores.push(
            `El rango de fechas indica ${diffEnDias} días, pero se reportaron mas días `
         );
         return errores;
      }

      const diasUsadosTomados = Number(this.#dias_usados_tomados) || 0;
      const diasUsadosVendidos = Number(this.#dias_usados_vendidos) || 0;
      console.log("Dias tomados en anteriores vacaciones:", diasUsadosTomados);
      console.log("Dias vendidos en anteriores vacaciones", diasUsadosVendidos);

      let maxTomadosTotal = 0;
      let maxVendidosTotal = 0;

      for (const contrato of this.#contratos_laborales) {
         if (!["GENERAL", "MYPE"].includes(contrato.regimen)) {
            errores.push(`Régimen no válido en contrato: ${contrato.regimen}`);
            continue;
         }

         const inicio = new Date(contrato.fecha_inicio);
         const fin = new Date(contrato.fecha_fin);
         const fechaFin = fin > hoy ? hoy : fin;
         const meses = [];

         let actual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
         while (actual <= fechaFin) {
            meses.push(new Date(actual));
            actual = sumarMeses(actual, 1);
         }
         let totalContratoTomados = 0;
         let totalContratoVendibles = 0;
         for (const inicioMes of meses) {
            const anio = inicioMes.getFullYear();
            const mes = inicioMes.getMonth();
            const finMes = new Date(anio, mes + 1, 0);
            const diasLaborablesTotales = contarDiasLaborablesDelMes(anio, mes);

            const inicioReal = inicioMes < inicio ? inicio : inicioMes;
            const finReal = finMes > fechaFin ? fechaFin : finMes;
            const diasTrabajados = contarDiasLaborables(inicioReal, finReal);

            // Tasa por régimen
            const tasaVacaciones = contrato.regimen === "MYPE" ? 1.25 : 2.5;
            const tasaVendibles = contrato.regimen === "MYPE" ? 8 / 12 : 1.25;
            //La proporcion obtenie los dias que lobaroraste enre los dias del mes laborales
            //Esto se hace porque recuerda que los contratos no siempre inicia los 01
            //o temrian exacto el ultimo dia del mes
            // ejemplo el mes tiene 22 dias laborales
            //  iniciaste un 15, y hast fin de mes tienes 11 dias laborales
            //  11/22--->  0.5*1.25 ---> 0.625
            //  ese mes solo obtuviste 0.625  del 1.25 de dia que te da tu regimen por mes
            //  solo para comprobar multiplicamos --> 0.625 *2 ---> 1.25
            const proporcionVacaciones =
               (diasTrabajados / diasLaborablesTotales) * tasaVacaciones;
            const proporcionVendibles =
               (diasTrabajados / diasLaborablesTotales) * tasaVendibles;
            totalContratoTomados += proporcionVacaciones;
            totalContratoVendibles += proporcionVendibles;
         }
         maxTomadosTotal += totalContratoTomados;
         maxVendidosTotal += totalContratoVendibles;
         console.log(
            `→ Contrato ${contrato.fecha_inicio} a ${contrato.fecha_fin}`
         );
         console.log(`  Régimen: ${contrato.regimen}`);
         console.log(
            `  Generado para tomar: ${totalContratoTomados.toFixed(2)} días`
         );
         console.log(
            `  Generado para vender: ${totalContratoVendibles.toFixed(2)} días`
         );
      }
      console.log("MAX TOMADO TOTAL: ", maxTomadosTotal);
      console.log("MAX VENDIDOS TOTAL: ", maxVendidosTotal);
      // Suma total de días usados y actuales
      console.log("Dias del usario quiere tomar", this.#dias_tomados);
      console.log("Dias del usario que quiere vender", this.#dias_vendidos);

      const totalTomados = diasUsadosTomados + this.#dias_tomados;
      const totalVendidos = diasUsadosVendidos + this.#dias_vendidos;
      const totalGeneral = totalTomados + totalVendidos;

      // Comparación con redondeo a 2 decimales
      const maxT = parseFloat(maxTomadosTotal.toFixed(2));
      const maxV = parseFloat(maxVendidosTotal.toFixed(2));
      const maxDisponible = parseFloat(maxTomadosTotal.toFixed(2));

      if (totalTomados > maxT) {
         errores.push(
            `El total de días tomados (${totalTomados}) excede el permitido (${maxT}).`
         );
      }

      if (totalVendidos > maxV) {
         errores.push(
            `El total de días vendidos (${totalVendidos}) excede el permitido (${maxV}).`
         );
      }

      if (totalGeneral > maxDisponible) {
         errores.push(
            `La suma total de días tomados y vendidos (${totalGeneral}) excede el permitido (${maxDisponible}).`
         );
      }
      return errores;
   }

   get() {
      return {
         trabajador_id: this.#trabajador_id,
         fecha_inicio: this.#fecha_inicio,
         fecha_termino: this.#fecha_termino,
         observaciones: this.#observaciones,
         estado: this.estado,
      };
   }
   getAsistenciasOrdenadas() {
      return this.asistenciasXvacaciones;
   }
}

module.exports = Vacaciones;
