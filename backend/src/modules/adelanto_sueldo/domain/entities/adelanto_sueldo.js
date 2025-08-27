class AdelantoSueldo {
   constructor({ id, trabajador_id, fecha, monto, observacion,tipo }) {
      this.id = id;
      this.trabajador_id = trabajador_id;
      this.fecha = fecha;
      this.monto = monto;
      this.observacion = observacion;
      this.tipo=tipo
   }
   validarCamposObligatorios(editar = false) {
      let errores = [];
      if (editar) {
         if (!this.id) {
            errores.push("Datos incompletos");
         }
      }
      else{
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
      const options=["simple","gratificacion","cts"];
      if(!options.includes(this.tipo)){
         errores.push("El tipo de adelanto de sueldo no existe")
      }
      return errores;
   }
   construirDatosAdelantoSueldo(editar = false) {
      let data = {
         fecha: this.fecha,
         monto: this.monto,
         observacion: this.observacion,
         tipo:this.tipo
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
