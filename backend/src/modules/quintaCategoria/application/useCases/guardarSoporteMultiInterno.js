class GuardarSoporteMultiInterno {
  constructor({ soporteRepo }) {
    this.soporteRepo = soporteRepo;
  }

  async execute({ quintaCalculoId, baseCtx, transaction }) {
    if (!Number.isFinite(Number(quintaCalculoId))) {
      const e = new Error("quintaCalculoId inválido");
      e.status = 400; throw e;
    }
    const base = baseCtx || {};
    const remu = base.remu_multi || {};
    const grati = base.grati_multi || {};
    const af = base.af_multi || {};

    // Normalizamos estructura exacta solicitada
    const paraGuardarMultiInterno = {
      remu_multi: {
        detalle_por_filial: Array.isArray(remu.detalle_por_filial) ? remu.detalle_por_filial.map(x => ({
          filial_id: Number(x.filial_id) || null,
          contrato_id: Number(x.contrato_id || x.id_contrato || x.id) || null,
          sueldo: Number(x.sueldo || 0),
          previos_meses: Number(x.previos_meses || 0),
          previos_monto: Number(x.previos_monto || 0),
          proj_meses: Number(x.proj_meses || 0),
          proj_monto: Number(x.proj_monto || 0),
          mes_actual_monto: Number(x.mes_actual_monto || 0),
        })) : [],
        mes_actual_otras: Number(remu.mes_actual_otras || 0),
      },
      grati_multi: {
        detalle_por_filial: Array.isArray(grati.detalle_por_filial) ? grati.detalle_por_filial.map(x => ({
          filial_id: Number(x.filial_id) || null,
          julio: {
            real: Number(x?.julio?.real || 0),
            trunca: Number(x?.julio?.trunca || 0),
            usado: Number(x?.julio?.usado || 0),
            proj: Number(x?.julio?.proj || 0),
          },
          diciembre: {
            real: Number(x?.diciembre?.real || 0),
            trunca: Number(x?.diciembre?.trunca || 0),
            usado: Number(x?.diciembre?.usado || 0),
            proj: Number(x?.diciembre?.proj || 0),
          },
        })) : [],
      },
      af_multi: {
        detalle_por_filial: Array.isArray(af.detalle_por_filial) ? af.detalle_por_filial.map(x => ({
          filial_id: Number(x.filial_id) || null,
          previos_meses: Number(x.previos_meses || 0),
          previos_monto: Number(x.previos_monto || 0),
          proj_meses: Number(x.proj_meses || 0),
          proj_monto: Number(x.proj_monto || 0),
        })) : [],
      },
      total_ingresos: Number(base.total_ingresos || 0),
    };

    // Persistimos soporte y devolvemos el id
    const soporte = await this.soporteRepo.crearSoporteMultiInterno({
      quinta_calculo_id: Number(quintaCalculoId),
      remu_multi_json: paraGuardarMultiInterno.remu_multi,
      grati_multi_json: paraGuardarMultiInterno.grati_multi,
      af_multi_json: paraGuardarMultiInterno.af_multi,
      total_ingresos: paraGuardarMultiInterno.total_ingresos,
      transaction,
    });

    // Enlazamos en quinta_calculos.soporte_multi_interno_id
    await this.soporteRepo.actualizarQuintaSetSoporteMultiInterno({
      quinta_calculo_id: Number(quintaCalculoId),
      soporte_multi_interno_id: Number(soporte.id),
      transaction,
    });

    return { id: soporte.id, snapshot: paraGuardarMultiInterno };
  }
}

module.exports = GuardarSoporteMultiInterno;