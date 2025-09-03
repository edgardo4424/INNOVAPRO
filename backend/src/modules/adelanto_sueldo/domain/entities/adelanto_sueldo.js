const destruturarFecha = require("../../infraestructure/repositories/utils/destructurarFecha");

class AdelantoSueldo {
   constructor({
      id,
      trabajador_id,
      fecha,
      monto,
      observacion,
      tipo,
      primera_cuota,
      forma_descuento,
      cuotas,
      cuotas_pagadas,
   }) {
      this.id = id;
      this.trabajador_id = trabajador_id;
      this.fecha = fecha;
      this.monto = monto;
      this.observacion = observacion;
      this.tipo = tipo;
      this.forma_descuento = forma_descuento;
      this.cuotas = cuotas;
      this.cuotas_pagadas = cuotas_pagadas;
      this.primera_cuota = primera_cuota;
   }
   validarCamposObligatorios(editar = false) {
      let errores = [];
      if (editar) {
         if (!this.id) {
            errores.push("Datos incompletos");
         }
         if (this.cuotas_pagadas > 0) {
            errores.push(
               "No se puede editar este adelanto, ya cuenta con cuotas pagadas;"
            );
         }
      } else {
         if (!this.trabajador_id) {
            errores.push("El campo 'trabajador_id' es obligatorio.");
         }
      }
      if (!this.fecha) {
         errores.push("El campo 'fecha' es obligatorio.");
      }
      if (this.monto == null || this.monto === "") {
         errores.push("El campo 'monto' es obligatorio.");
      } else if (isNaN(this.monto) || this.monto <= 0) {
         errores.push("El campo 'monto' debe ser un número positivo.");
      }
      const options = ["simple", "gratificacion", "cts"];
      if (!options.includes(this.tipo)) {
         errores.push("El tipo de adelanto de sueldo no existe");
      }
      const f_desc = ["mensual", "quincenal"];
      if (!f_desc.includes(this.forma_descuento)) {
         errores.push("El tipo de forma de pago no ");
      }
      if (!this.primera_cuota) {
         errores.push("Ingrese fecha de la primera cuota");
      } else {
         const fecha_recibida = this.primera_cuota;
         const hoy = new Date().toISOString().split("T")[0];
         const { anio, mes, dia } = destruturarFecha(fecha_recibida);
         const { anio: anio_h, mes: mes_h, dia: dia_h } = destruturarFecha(hoy);
         if(fecha_recibida<hoy){
            errores.push("La fecha de la primera cuota es menor a hoy.");
      
         }
         const dias_mes_fecha_recibida = new Date(anio, mes, 0).getDate();
         if(!dias_mes_fecha_recibida) errores.push('Fallo el conteo de los dias del mes ')
         const dias_aceptados=[15,dias_mes_fecha_recibida];

         console.log('Dias de la fecha recibida',dias_mes_fecha_recibida);
         

                  errores.push("Aun no crear");

      }
      if (this.cuotas < 1) {
         errores.push("Numero de cuotas no validas");
      }
      console.log(errores);
      
      return errores;
   }
   construirDatosAdelantoSueldo(editar = false) {
      let data = {
         fecha: this.fecha,
         monto: this.monto,
         observacion: this.observacion,
         tipo: this.tipo,
      };
      if (editar) {
         data.adelanto_sueldo_id = this.id;
      } else {
         data.trabajador_id = this.trabajador_id;
      }
      return data;
   }
}

module.exports = AdelantoSueldo;
