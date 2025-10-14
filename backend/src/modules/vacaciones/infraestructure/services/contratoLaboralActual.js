const db = require("../../../../database/models");
const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

async function obtenerImporteDiasVendidos(
   contratos_laborales,
   asignacion_familiar,
   dias_vendidos
) {
   const hoy = new Date();
   console.log("📌 Fecha actual:", hoy);

   const contratoActual = contratos_laborales.find((c) => {
      const inicio = new Date(c.fecha_inicio);
      const fin = new Date(c.fecha_fin);
      console.log("🔎 Evaluando contrato:", c);
      console.log("   ➡ Fecha inicio:", inicio, "Fecha fin:", fin);
      console.log("   ➡ Vigente?", hoy >= inicio && hoy <= fin);
      return hoy >= inicio && hoy <= fin;
   });

   if (!contratoActual) {
      console.log("❌ No se encontró contrato vigente");
      throw new Error("No se encontro contrato vigente");
   }

   console.log("✅ Contrato actual:", contratoActual);

   let sueldo_bruto = Number(contratoActual.sueldo);
   console.log("💰 Sueldo base:", sueldo_bruto);

   if (asignacion_familiar) {
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      console.log("➕ Asignación familiar:", MONTO_ASIGNACION_FAMILIAR);
      sueldo_bruto += MONTO_ASIGNACION_FAMILIAR;
   }

   console.log("💵 Sueldo bruto con asignación:", sueldo_bruto);

   const vacaciones = (sueldo_bruto / 30) * Number(dias_vendidos);
   console.log("🏖️ Vacaciones (importe por días vendidos):", vacaciones);

   let sueldo = vacaciones;

   const MONTO_AFP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
   );
   console.log("📊 MONTO_AFP (%):", MONTO_AFP);

   const MONTO_PRIMA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro")).valor
   );
   console.log("📊 MONTO_PRIMA (%):", MONTO_PRIMA);

   const descuentos =
      vacaciones * (MONTO_AFP / 100) + vacaciones * (MONTO_PRIMA / 100);
   console.log("🧾 Descuentos calculados:", descuentos);

   sueldo = sueldo - descuentos;
   console.log("✅ Sueldo final:", sueldo);

   return sueldo;
}

module.exports = {
   obtenerImporteDiasVendidos,
};
