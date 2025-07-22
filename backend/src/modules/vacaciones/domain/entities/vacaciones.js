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
   }

   // Auxiliar: contar días entre dos fechas (inclusive)
   static contarDias(fechaInicio, fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
   }

   // Auxiliar: obtener la intersección de dos rangos de fechas
   static interseccionRango(f1_inicio, f1_fin, f2_inicio, f2_fin) {
      const inicio = new Date(
         Math.max(new Date(f1_inicio), new Date(f2_inicio))
      );
      const fin = new Date(Math.min(new Date(f1_fin), new Date(f2_fin)));
      return inicio <= fin ? { inicio, fin } : null;
   }

   validarCampos() {
      const errores = [];

      if (!this.#trabajador_id) {
         errores.push("No existe el trabajador.");
      }

      if (
         !Array.isArray(this.#contratos_laborales) ||
         this.#contratos_laborales.length === 0
      ) {
         errores.push("No se han proporcionado contratos laborales.");
         return errores;
      }

      const fechaVacInicio = new Date(this.#fecha_inicio);
      const fechaVacFin = new Date(this.#fecha_termino);
      if (fechaVacFin < fechaVacInicio) {
         errores.push(
            "La fecha de término no puede ser anterior a la fecha de inicio."
         );
      }

      const diffEnDias = Vacaciones.contarDias(
         this.#fecha_inicio,
         this.#fecha_termino
      );

      if (diffEnDias !== this.#dias_tomados) {
         errores.push(
            `El rango de fechas indica ${diffEnDias} días, pero se reportaron ${
               this.#dias_tomados
            } días tomados.`
         );
      }

      const diasUsadosTomados = Number(this.#dias_usados_tomados) || 0;
      const diasUsadosVendidos = Number(this.#dias_usados_vendidos) || 0;

      let maxTomadosTotal = 0;
      let maxVendidosTotal = 0;
      let maxTotalGlobal = 0;
      let diasEnContratos = 0;

      const hoy = new Date();

      for (const contrato of this.#contratos_laborales) {
         if (!["GENERAL", "MYPE"].includes(contrato.regimen)) {
            errores.push(`Régimen no válido en contrato: ${contrato.regimen}`);
            continue;
         }

         const fechaFinContratoReal =
            new Date(contrato.fecha_fin) > hoy
               ? hoy
               : new Date(contrato.fecha_fin);

         const diasTrabajados = Vacaciones.contarDias(
            contrato.fecha_inicio,
            fechaFinContratoReal
         );

         if (diasTrabajados < 150) {
            errores.push(
               `El trabajador aún no cumple 5 meses de trabajo en el contrato iniciado el ${contrato.fecha_inicio}.`
            );
         }

         const inter = Vacaciones.interseccionRango(
            this.#fecha_inicio,
            this.#fecha_termino,
            contrato.fecha_inicio,
            fechaFinContratoReal
         );

         if (inter) {
            const diasEnEsteContrato = Vacaciones.contarDias(
               inter.inicio,
               inter.fin
            );

            let baseTomados, baseVendidos, baseTotal;
            if (contrato.regimen === "GENERAL") {
               baseTomados = 30;
               baseVendidos = 15;
               baseTotal = 30;
            } else if (contrato.regimen === "MYPE") {
               baseTomados = 15;
               baseVendidos = 8;
               baseTotal = 15;
            }

            const proporcion = diasEnEsteContrato / diasTrabajados;

            maxTomadosTotal += proporcion * baseTomados;
            maxVendidosTotal += proporcion * baseVendidos;
            maxTotalGlobal += proporcion * baseTotal;
            diasEnContratos += diasEnEsteContrato;
         }
      }

      const totalTomados = diasUsadosTomados + this.#dias_tomados;
      const totalVendidos = diasUsadosVendidos + this.#dias_vendidos;
      const totalGeneral = totalTomados + totalVendidos;

      if (totalTomados > Math.floor(maxTomadosTotal)) {
         errores.push(
            `El total de días tomados (${totalTomados}) excede el permitido (${Math.floor(
               maxTomadosTotal
            )}) para el periodo de vacaciones solicitado.`
         );
      }

      if (totalVendidos > Math.floor(maxVendidosTotal)) {
         errores.push(
            `El total de días vendidos (${totalVendidos}) excede el permitido (${Math.floor(
               maxVendidosTotal
            )}) para el periodo de vacaciones solicitado.`
         );
      }

      if (totalGeneral > Math.floor(maxTotalGlobal)) {
         errores.push(
            `La suma total de días tomados y vendidos (${totalGeneral}) excede el permitido (${Math.floor(
               maxTotalGlobal
            )}) para el periodo de vacaciones solicitado.`
         );
      }

      if (diasEnContratos < diffEnDias) {
         errores.push(
            `El periodo de vacaciones solicitado (${diffEnDias} días) no está completamente cubierto por los contratos laborales (${diasEnContratos} días encontrados).`
         );
      }

      return errores;
   }

   get() {
      return {
         trabajador_id: this.#trabajador_id,
         fecha_inicio: this.#fecha_inicio,
         fecha_termino: this.#fecha_termino,
         dias_tomados: this.#dias_tomados,
         dias_vendidos: this.#dias_vendidos,
         dias_usados_tomados: this.#dias_usados_tomados,
         dias_usados_vendidos: this.#dias_usados_vendidos,
         observaciones: this.#observaciones,
         contratos_laborales: this.#contratos_laborales,
      };
   }
}

module.exports = Vacaciones;
