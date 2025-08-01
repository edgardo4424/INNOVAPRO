class ContratoLaboral {
   constructor({ trabajador_id, fecha_inicio, fecha_fin, sueldo, regimen }) {
      this.trabajador_id = trabajador_id;
      this.fecha_inicio = fecha_inicio;
      this.fecha_fin = fecha_fin;
      this.sueldo = sueldo;
      this.regimen = regimen;
   }

   validar() {
      const errores = [];
      console.log(this.sueldo);
      
      if (typeof this.trabajador_id !== "number" || isNaN(this.trabajador_id)) {
         errores.push("El ID del trabajador debe ser un número válido.");
      }

      const inicio = new Date(this.fecha_inicio);
      const fin = new Date(this.fecha_fin);

      if (isNaN(inicio.getTime())) {
         errores.push("La fecha de inicio no es válida.");
      }

      if (isNaN(fin.getTime())) {
         errores.push("La fecha de fin no es válida.");
      }

      if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && inicio >= fin) {
         errores.push(
            "La fecha de fin debe ser posterior a la fecha de inicio."
         );
      }

      if ( this.sueldo <= 1130) {
         errores.push("El sueldo debe ser un número mayor a 1130.");
      }

      const regimenValido = ["MYPE", "GENERAL"];
      if (!regimenValido.includes(this.regimen)) {
         errores.push('El régimen debe ser "MYPE" o "GENERAL".');
      }

      return errores;
   }
   get() {
      return {
         trabajador_id: this.trabajador_id,
         fecha_inicio: this.fecha_inicio,
         fecha_fin: this.fecha_fin,
         sueldo: this.sueldo,
         regimen: this.regimen,
      };
   }
}

module.exports = ContratoLaboral;
