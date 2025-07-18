class Vacaciones {
   // Propiedades privadas
   #trabajador_id;
   #fecha_inicio;
   #fecha_termino;
   #dias_tomados;
   #dias_vendidos;
   #observaciones;
   #regimen;

   constructor({
      trabajador_id,
      fecha_inicio,
      fecha_termino,
      dias_tomados,
      dias_vendidos,
      observaciones,
      regimen,
   }) {
      this.#trabajador_id = trabajador_id;
      this.#fecha_inicio = fecha_inicio;
      this.#fecha_termino = fecha_termino;
      this.#dias_tomados = dias_tomados;
      this.#dias_vendidos = dias_vendidos;
      this.#observaciones = observaciones;
      this.#regimen = regimen;
   }

   // Método de validación con acceso a propiedades privadas
   validarCampos() {
      const errores = [];

      const fechaInicio = new Date(this.#fecha_inicio);
      const fechaTermino = new Date(this.#fecha_termino);
      const totalVacaciones = this.#dias_tomados + this.#dias_vendidos;
      if (!this.#trabajador_id) {
         errores.push("No existe el trabajador.");
      }
      // Validar régimen
      if (!["GENERAL", "MYPE"].includes(this.#regimen)) {
         errores.push('Régimen no válido. Debe ser "GENERAL" o "MYPE".');
      }

      // Validar días máximos según régimen
      if (this.#regimen === "GENERAL") {
         if (this.#dias_tomados > 30) {
            errores.push(
               "En el régimen GENERAL, no se pueden tomar más de 30 días."
            );
         }
         if (this.#dias_vendidos > 15) {
            errores.push(
               "En el régimen GENERAL, solo se pueden vender hasta 15 días."
            );
         }
         if (totalVacaciones > 30) {
            errores.push(
               "La suma de días tomados y vendidos no puede exceder los 30 días en régimen GENERAL."
            );
         }
      }

      if (this.#regimen === "MYPE") {
         if (this.#dias_tomados > 15) {
            errores.push(
               "En el régimen MYPE, no se pueden tomar más de 15 días."
            );
         }
         if (this.#dias_vendidos > 8) {
            errores.push(
               "En el régimen MYPE, solo se pueden vender hasta 8 días."
            );
         }
         if (totalVacaciones > 15) {
            errores.push(
               "La suma de días tomados y vendidos no puede exceder los 15 días en régimen MYPE."
            );
         }
      }

      // Validar fechas
      if (fechaTermino < fechaInicio) {
         errores.push(
            "La fecha de término no puede ser anterior a la fecha de inicio."
         );
      }

      // Validar que el rango de fechas coincida con los días tomados
      const diffEnMs = fechaTermino - fechaInicio;
      const diffEnDias = Math.ceil(diffEnMs / (1000 * 60 * 60 * 24)) + 1;

      if (diffEnDias !== this.#dias_tomados) {
         errores.push(
            `El rango de fechas indica ${diffEnDias} días, pero se reportaron ${
               this.#dias_tomados
            } días tomados.`
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
         observaciones: this.#observaciones,
      };
   }
}
module.exports = Vacaciones;
