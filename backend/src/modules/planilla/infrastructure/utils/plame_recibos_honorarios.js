const plame_recibo_por_honorario = async (trabajadorRepository, recibo) => {    
    const t = await trabajadorRepository.obtenerTrabajadorSimplePorId(
      recibo.trabajador_id
   );

   const tipo_doc = t.domiciliado ? "06" : "04";
   
   const numero_doc = t.domiciliado
      ? t.ruc ?? "No definido"
      : t.numero_documento;
   const recibo_construido = `${tipo_doc}|${numero_doc}|${recibo.tipo_comprobante_emitido}|${recibo.numero_comprobante_emitido}|${recibo.monto_total_servicio}|${recibo.fecha_emision}|${recibo.fecha_pago}|${recibo.indicador_retencion_cuarta_categoria}|${recibo.indicador_retencion_regimen_pensionario}|${recibo.importe_aporte_regimen_pensionario}`;
   return recibo_construido;
};

module.exports = plame_recibo_por_honorario;
