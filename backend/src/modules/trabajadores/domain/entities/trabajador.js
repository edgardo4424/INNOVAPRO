class Trabajador {
   constructor({
      filial_id,
      nombres,
      apellidos,
      numero_documento,
      fecha_ingreso,
      sueldo_base,
      asignacion_familiar,
      sistema_pension,
      quinta_categoria,
      tipo_documento,
   }) {
      (this.filial_id = filial_id),
         (this.nombres = nombres),
         (this.apellidos = apellidos),
         (this.tipo_documento = tipo_documento),
         (this.numero_documento = numero_documento),
         (this.fecha_ingreso = fecha_ingreso),
         (this.sueldo_base = sueldo_base),
         (this.asignacion_familiar = asignacion_familiar),
         (this.sistema_pension = sistema_pension),
         (this.quinta_categoria = quinta_categoria);
   }

   validarCamposObligatorios(modo = "crear") {
      const errores = [];
      console.log('sisye',this.sistema_pension);
      
      if (modo === "crear") {
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
         if (!this.fecha_ingreso || !this.fecha_ingreso.trim()) {
            errores.push("fecha_ingreso inválida");
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
         return errores;
      }
      if (modo === "editar") {
         return errores;
      }
   }
   get() {
      return {
         filial_id: this.filial_id,
         nombres: this.nombres,
         apellidos: this.apellidos,
         tipo_documento: this.tipo_documento,
         numero_documento: this.numero_documento,
         fecha_ingreso: this.fecha_ingreso,
         sueldo_base: this.sueldo_base,
         asignacion_familiar: this.asignacion_familiar,
         sistema_pension: this.sistema_pension,
         quinta_categoria: this.quinta_categoria,
      };
   }
}

module.exports = Trabajador;
