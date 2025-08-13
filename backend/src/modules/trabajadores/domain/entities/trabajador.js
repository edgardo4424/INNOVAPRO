class Trabajador {
   constructor({
      id,
      filial_id,
      nombres,
      apellidos,
      numero_documento,
      sueldo_base,
      asignacion_familiar,
      sistema_pension,
      quinta_categoria,
      tipo_documento,
      cargo_id,
   }) {
      (this.id = id),
         (this.filial_id = filial_id),
         (this.nombres = nombres),
         (this.apellidos = apellidos),
         (this.tipo_documento = tipo_documento),
         (this.numero_documento = numero_documento),
         (this.sueldo_base = sueldo_base),
         (this.asignacion_familiar = asignacion_familiar),
         (this.sistema_pension = sistema_pension),
         (this.quinta_categoria = quinta_categoria),
         (this.cargo_id = cargo_id);
   }

   validarCamposObligatorios(editar = false) {
      const errores = [];
      if (editar) {
         if (!this.id) {
            errores.push("El id es inválido");
         }
      }
      if (this.filial_id <= 0) {
         errores.push("filial_id inválido");
      }
      if (!this.nombres || !this.apellidos) {
         errores.push("Nombres o apellidos invalidos");
      }
      if (
         this.tipo_documento !== "DNI" &&
         this.tipo_documento !== "CE" &&
         this.tipo_documento !== "PTP"
      ) {
         errores.push("El tipo de documento es invalido");
      }
      if (!this.numero_documento || !this.numero_documento.trim()) {
         errores.push("Número de documento inválido");
      }
      if (this.sueldo_base < 1130) {
         errores.push("El sueldo base es invalido");
      }
      if (
         this.asignacion_familiar === null ||
         this.asignacion_familiar === undefined
      ) {
         errores.push("Asignacion familiar inválida");
      }
      if (this.sistema_pension !== "AFP" && this.sistema_pension !== "ONP") {
         console.log(this.sistema_pension);

         errores.push("El sistema de pension es inválido.");
      }
      if (
         this.quinta_categoria === null ||
         this.quinta_categoria === undefined
      ) {
         errores.push("Quinta categoría es inválida.");
      }
      if (this.cargo_id === null) {
         errores.push("El cargo no se a enviado");
      }
      return errores;
   }

   get(editar = false) {
      const datos = {
         filial_id: this.filial_id,
         nombres: this.nombres,
         apellidos: this.apellidos,
         tipo_documento: this.tipo_documento,
         numero_documento: this.numero_documento,
         sueldo_base: this.sueldo_base,
         asignacion_familiar: this.asignacion_familiar,
         sistema_pension: this.sistema_pension,
         quinta_categoria: this.quinta_categoria,
         cargo_id: this.cargo_id,
      };
      if (editar) {
         datos.trabajador_id = this.id;
      }
      return datos;
   }
}

module.exports = Trabajador;
