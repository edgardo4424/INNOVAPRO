class Stock {
   constructor({ pieza_id, stock_fijo, stock_disponible }) {
      this.errors = [];
      this.pieza_id = pieza_id;
      this.stock_fijo = stock_fijo;
      this.stock_disponible = stock_disponible;
   }

   isInteger(value) {
      return Number.isInteger(value);
   }
   validarCampo(valor, nombre) {
      if (valor === undefined || valor === null) {
         this.errors.push(`El campo '${nombre}' es obligatorio.`);
         return;
      }

      if (!this.isInteger(valor)) {
         this.errors.push(`El campo '${nombre}' debe ser un número entero.`);
         return;
      }
      if (valor < 0) {
         this.errors.push(`El campo '${nombre}' no puede ser negativo.`);
      }
   }

   isValid() {
      this.errors = [];

      this.validarCampo(this.pieza_id, "pieza_id");
      this.validarCampo(this.stock_fijo, "stock_fijo");
      this.validarCampo(this.stock_disponible, "stock_disponible");
      return this.errors.length === 0;
   }

   getErrors() {
      return this.errors;
   }
}

module.exports = Stock;
