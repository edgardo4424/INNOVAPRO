class ReciboPorHonorario {
   constructor({
      id,
      trabajador_id,
      tipo_comprobante_emitido,
      serie_comprobante_emitido,
      numero_comprobante_emitido,
      monto_total_servicio,
      fecha_emision,
      fecha_pago,
      indicador_retencion_cuarta_categoria,
      indicador_retencion_regimen_pensionario,
      importe_aporte_regimen_pensionario,
   }) {
      this.id = id;
      this.trabajador_id = trabajador_id;
      this.tipo_comprobante_emitido = tipo_comprobante_emitido;
      this.serie_comprobante_emitido = serie_comprobante_emitido;
      this.numero_comprobante_emitido = numero_comprobante_emitido;
      this.monto_total_servicio = monto_total_servicio;
      this.fecha_emision = fecha_emision;
      this.fecha_pago = fecha_pago;
      this.indicador_retencion_cuarta_categoria =
         indicador_retencion_cuarta_categoria;
      this.indicador_retencion_regimen_pensionario =
         indicador_retencion_regimen_pensionario;
      this.importe_aporte_regimen_pensionario =
         importe_aporte_regimen_pensionario;
   }

   validarCamposObligatorios(editar = false) {
      let errores = [];

      // Validación por edición o creación
      if (editar) {
         if (!this.id) {
            errores.push("Datos incompletos: falta 'id'");
         }
      } else {
         if (!this.trabajador_id) {
            errores.push("El campo 'trabajador_id' es obligatorio.");
         }
      }

      // Campos obligatorios básicos
      if (!this.tipo_comprobante_emitido) {
         errores.push("El campo 'tipo_comprobante_emitido' es obligatorio.");
      }
      if (!this.numero_comprobante_emitido) {
         errores.push("El campo 'numero_comprobante_emitido' es obligatorio.");
      }
      if (this.monto_total_servicio == null || this.monto_total_servicio === "") {
         errores.push("El campo 'monto_total_servicio' es obligatorio.");
      } else if (isNaN(this.monto_total_servicio) || this.monto_total_servicio <= 0) {
         errores.push("El monto total del servicio debe ser un número positivo.");
      }

      if (!this.fecha_emision) {
         errores.push("El campo 'fecha_emision' es obligatorio.");
      }

      // Validaciones específicas según reglas
      if (
         this.indicador_retencion_regimen_pensionario === "1" ||
         this.indicador_retencion_regimen_pensionario === "2"
      ) {
         if (
            this.importe_aporte_regimen_pensionario == null ||
            this.importe_aporte_regimen_pensionario === ""
         ) {
            errores.push(
               "El campo 'importe_aporte_regimen_pensionario' es obligatorio cuando hay retención pensionaria."
            );
         }
      }

      return errores;
   }

   construirDatos(editar = false) {
      let data = {
         tipo_comprobante_emitido: this.tipo_comprobante_emitido,
         serie_comprobante_emitido: this.serie_comprobante_emitido,
         numero_comprobante_emitido: this.numero_comprobante_emitido,
         monto_total_servicio: this.monto_total_servicio,
         fecha_emision: this.fecha_emision,
         fecha_pago: this.fecha_pago,
         indicador_retencion_cuarta_categoria:
            this.indicador_retencion_cuarta_categoria,
         indicador_retencion_regimen_pensionario:
            this.indicador_retencion_regimen_pensionario,
         importe_aporte_regimen_pensionario:
            this.importe_aporte_regimen_pensionario,
        
      };

      if (editar) {
         data.recibo_id = this.id;
      } else {
         data.trabajador_id = this.trabajador_id;
      }

      return data;
   }
}

module.exports = ReciboPorHonorario;
