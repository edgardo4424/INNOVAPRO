class ContratoLaboral {
   constructor({
      id,
      trabajador_id,
      fecha_inicio,
      fecha_fin,
      sueldo,
      regimen,
      tipo_contrato,
      filial_id,
      numero_cuenta,
      banco,
   }) {
      this.id = id;
      this.trabajador_id = trabajador_id;
      this.fecha_inicio = fecha_inicio;
      this.fecha_fin = fecha_fin;
      this.sueldo = sueldo;
      this.regimen = regimen;
      this.tipo_contrato = tipo_contrato;
      this.filial_id = filial_id;
      this.numero_cuenta = numero_cuenta;
      this.banco = banco;
   }

   validar(editar = false) {
      const errores = [];

      if (editar) {
         if (!this.id) {
            errores.push("Al editar el id es requerido");
         }
      } else {
         if (
            typeof this.trabajador_id !== "number" ||
            isNaN(this.trabajador_id)
         ) {
            errores.push("El ID del trabajador debe ser un número válido.");
         }
      }
      if (isNaN(this.filial_id)) {
         errores.push("El ID de la filial debe ser un número válido.");
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

      /* if (this.sueldo <= 1130) {
         errores.push("El sueldo debe ser un número mayor a 1130.");
      } */

      const regimenValido = ["MYPE", "GENERAL"];
      if (!regimenValido.includes(this.regimen)) {
         errores.push('El régimen debe ser "MYPE" o "GENERAL".');
      }

      const contrato_valido = ["PLANILLA", "HONORARIOS"];
      if (!contrato_valido.includes(this.tipo_contrato)) {
         errores.push("El tipo de contrato no es válido");
      }
     
      if (!this.banco || this.banco.trim() === "") {
         errores.push("El banco es obligatorio.");
      }
      if (!this.numero_cuenta || this.numero_cuenta.trim() === "") {
         errores.push("El número de cuenta es obligatorio.");
      } else if (this.numero_cuenta.length < 5) {
         errores.push("El número de cuenta debe tener al menos 5 caracteres.");
      }

      return errores;
   }
   get(editar = false) {
      if (editar) {
         return {
            contrato_id: this.id,
            fecha_inicio: this.fecha_inicio,
            filial_id: this.filial_id,
            fecha_fin: this.fecha_fin,
            sueldo: this.sueldo,
            regimen: this.regimen,
            tipo_contrato: this.tipo_contrato,
            banco: this.banco,
            numero_cuenta: this.numero_cuenta,
         };
      } else {
         return {
            trabajador_id: this.trabajador_id,
            filial_id: this.filial_id,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            sueldo: this.sueldo,
            regimen: this.regimen,
            tipo_contrato: this.tipo_contrato,
            banco: this.banco,
            numero_cuenta: this.numero_cuenta,
         };
      }
   }
}

module.exports = ContratoLaboral;
