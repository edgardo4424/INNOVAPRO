class Trabajador {
   constructor({
      id,
      nombres,
      apellidos,
      numero_documento,
      telefono,
      sueldo_base,
      asignacion_familiar,
      sistema_pension,
      tipo_documento,
      cargo_id,
      domiciliado,
      tipo_afp,
      comision_afp,
      fecha_baja,
      contratos_laborales,
      fecha_nacimiento
   }) {
      (this.id = id),
         (this.nombres = nombres),
         (this.apellidos = apellidos),
         (this.tipo_documento = tipo_documento),
         (this.numero_documento = numero_documento),
         (this.telefono = telefono),
         (this.sueldo_base = sueldo_base),
         (this.asignacion_familiar = asignacion_familiar),
         (this.sistema_pension = sistema_pension),
         (this.cargo_id = cargo_id);
      this.domiciliado = domiciliado;
      this.tipo_afp = tipo_afp;
      this.comision_afp = comision_afp;
      this.fecha_baja = fecha_baja;
      this.contratos_laborales = contratos_laborales;
      this.fecha_nacimiento = fecha_nacimiento;
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
      if (!this.telefono || !this.telefono.trim()) {
         errores.push("Número de teléfono inválido");
      }
     /*  if (this.sueldo_base < 1130) {
         errores.push("El sueldo base es invalido");
      } */
      if (this.domiciliado === null || this.domiciliado === undefined) {
         errores.push("Dato domiciliado inválida");
      }
      if (this.asignacion_familiar === undefined) {
         errores.push("Asignacion familiar inválida");
      }
      if (
         !this.fecha_nacimiento ||
         new Date(this.fecha_nacimiento) > new Date()
      ) {
         errores.push("Fecha de nacimiento inválida");
      }

      if (this.cargo_id === null) {
         errores.push("El cargo no se a enviado");
      }
      
      const hoy = new Date().toISOString().split("T")[0];
      const c_a = this.contratos_laborales.find(
         (c) => c.fecha_inicio <= hoy && hoy <= c.fecha_fin
      );
      if(!c_a){
         errores.push("No se encontró un contrato laboral vigente para la fecha actual.");
         return errores;
      }

      if (c_a.tipo_contrato == "PLANILLA") {
         if (this.sistema_pension !== "AFP" && this.sistema_pension !== "ONP") {
            errores.push("El sistema de pension es inválido.");
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
         if (this.sistema_pension === "ONP") {
            this.comision_afp = false;
         }
      } else {
         this.sistema_pension = null;
         this.tipo_afp = null;
         this.comision_afp = false;
      }

      return errores;
   }

   get(editar = false) {
      const datos = {
         nombres: this.nombres,
         apellidos: this.apellidos,
         tipo_documento: this.tipo_documento,
         numero_documento: this.numero_documento,
         telefono: this.telefono,
         sueldo_base: this.sueldo_base,
         asignacion_familiar: this.asignacion_familiar,
         sistema_pension: this.sistema_pension || null,
         cargo_id: this.cargo_id,
         domiciliado: this.domiciliado,
         tipo_afp: this.tipo_afp,
         comision_afp: this.comision_afp,
         fecha_baja: this.fecha_baja,
         fecha_nacimiento:this.fecha_nacimiento
      };
      if (editar) {
         datos.trabajador_id = this.id;
      }

      return datos;
   }
}

module.exports = Trabajador;
