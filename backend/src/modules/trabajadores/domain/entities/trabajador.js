class Trabajador {
   constructor({
      id,
      nombres,
      apellidos,
      numero_documento,
      sueldo_base,
      asignacion_familiar,
      sistema_pension,
      tipo_documento,
      cargo_id,
      domiciliado,
      tipo_afp,
   }) {
      (this.id = id),
         (this.nombres = nombres),
         (this.apellidos = apellidos),
         (this.tipo_documento = tipo_documento),
         (this.numero_documento = numero_documento),
         (this.sueldo_base = sueldo_base),
         (this.asignacion_familiar = asignacion_familiar),
         (this.sistema_pension = sistema_pension),
         (this.cargo_id = cargo_id);
      this.domiciliado = domiciliado;
      this.tipo_afp = tipo_afp;
   }

   validarCamposObligatorios(editar = false) {
      const errores = [];
      if (editar) {
         if (!this.id) {
            errores.push("El id es inválido");
         }
      }
      if (!this.nombres || !this.apellidos) {
         errores.push("Nombres o apellidos invalidos");
      }
      if (this.tipo_documento !== "DNI" && this.tipo_documento !== "CE") {
         errores.push("El tipo de documento es invalido");
      }
      if (!this.numero_documento || !this.numero_documento.trim()) {
         errores.push("Número de documento inválido");
      }
      if (this.sueldo_base < 1130) {
         errores.push("El sueldo base es invalido");
      }
      if (this.domiciliado === null || this.domiciliado === undefined) {
         errores.push("Dato domiciliado inválida");
      }
      if (this.asignacion_familiar === undefined) {
         errores.push("Asignacion familiar inválida");
      }
      if (this.sistema_pension !== "AFP" && this.sistema_pension !== "ONP") {
         console.log(this.sistema_pension);

         errores.push("El sistema de pension es inválido.");
      }
      if (this.cargo_id === null) {
         errores.push("El cargo no se a enviado");
      }
      if (this.sistema_pension === "AFP") {
         if (
            ["HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"].includes(
               this.tipo_afp
            ) === false
         ) {
            errores.push("El tipo de AFP es inválido");
         }
      }
      return errores;
   }

   get(editar = false) {
      const datos = {
         nombres: this.nombres,
         apellidos: this.apellidos,
         tipo_documento: this.tipo_documento,
         numero_documento: this.numero_documento,
         sueldo_base: this.sueldo_base,
         asignacion_familiar: this.asignacion_familiar,
         sistema_pension: this.sistema_pension,
         cargo_id: this.cargo_id,
         domiciliado: this.domiciliado,
         tipo_afp: this.tipo_afp,
      };
      if (editar) {
         datos.trabajador_id = this.id;
      }

      return datos;
   }
}

module.exports = Trabajador;
