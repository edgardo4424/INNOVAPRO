const { QueryTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const _ejecutarCalculoQuinta = require('./_ejecutarCalculoQuinta');
const SequelizeCalculoQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');
const GuardarCalculoQuinta = require('../useCases/guardarCalculoQuinta');
const RecalcularQuinta = require('../useCases/recalcularQuinta');

const repo = new SequelizeCalculoQuintaCategoriaRepository();
const guardarUC = new GuardarCalculoQuinta(repo);
const recalcularUC = new RecalcularQuinta(repo);

class ProcesarMasivoFilialQuinta {
  async execute({ anio, mes, filialId, usuarioId }) {
    if (!anio || !mes || mes < 1 || mes > 12 || !filialId) {
      const e = new Error("anio, mes (1-12) y filialId son obligatorios");
      e.status = 400; throw e;
    }
 
    const fechaRef = `${anio}-${String(mes).padStart(2,'0')}-15`;

    // Universo de trabajadores activos con contrato vigente al 15
    const trabajadores = await sequelize.query(`
      SELECT DISTINCT
        t.id  AS trabajador_id,
        t.numero_documento AS dni,
        cl.id AS contrato_id
      FROM contratos_laborales cl
      JOIN trabajadores t ON t.id = cl.trabajador_id
      WHERE t.estado = 'activo'
        AND cl.filial_id = :filialId
        AND cl.fecha_inicio <= :fechaRef
        AND (cl.fecha_fin IS NULL OR cl.fecha_fin >= :fechaRef)
        AND (cl.fecha_terminacion_anticipada IS NULL OR cl.fecha_terminacion_anticipada > :fechaRef)
      ORDER BY t.id
    `, { type: QueryTypes.SELECT, replacements: { filialId, fechaRef } });

    if (!Array.isArray(trabajadores) || trabajadores.length === 0) {
      const e = new Error("No hay trabajadores activos para esa filial / periodo.");
      e.status = 404; throw e;
    }

    const results = [];
    const startedAt = Date.now();

    for (const row of trabajadores) {
      const reqLike = {
        body: {
          trabajadorId: Number(row.trabajador_id),
          dni: String(row.dni || ''),
          anio,
          mes,
          __filialId: Number(filialId),
          __contratoId: Number(row.contrato_id),
        },
        user: { id: usuarioId }
      };

      let t;
      try {
        // 1) Calcular con tu motor central
        const { dto, ctx } = await _ejecutarCalculoQuinta(reqLike);

        // 1.1) Si NO es filial retentora (multiempleo inferido) -> NO persistir
        const meta = (ctx && ctx.soportes && ctx.soportes.meta) ? ctx.soportes.meta : {};
        const esSecundaria = !!meta.es_secundaria;
        const filialRetieneId = meta.filial_retiene_id ? Number(meta.filial_retiene_id) : null;
        const filialActualId = Number(ctx.filialActualId || filialId);

        if (esSecundaria || (filialRetieneId && filialRetieneId !== filialActualId)) {
          results.push({
            trabajadorId: ctx.trabajadorId,
            dni: ctx.dni,
            ok: true,
            skipped: 'filial_secundaria',
            retencion_base_mes: 0
          });
          continue;
        }

        // 2) Entradas visibles
        dto.entradas = {
          ...(dto.entradas || {}),
          remuneracion_mensual: ctx.remuneracionMensualActual,
          grati_julio_proj: ctx.base.gratiJulioProj,
          grati_diciembre_proj: ctx.base.gratiDiciembreProj,
          otros_ingresos_proj: 0,
          extra_gravado_mes: 0,
        };

        // 3) Transacción por trabajador
        t = await sequelize.transaction();

        // 3.1) Idempotencia: si ya existe OFICIAL del periodo -> RECALCULAR (update); si no, CREAR
        const existente = await repo.findOficialByPeriodo({
          dni: ctx.dni, anio: ctx.anio, mes: ctx.mes
        }, { transaction: t });

        const payload = {
          trabajador_id: dto.trabajador_id,
          contrato_id: dto.contrato_id,
          filial_actual_id: ctx.filialActualId,
          es_secundaria: ctx.soportes.meta.es_secundaria ? 1 : 0,
          filial_retenedora_id: ctx.soportes.meta.filial_retiene_id,
          dni: dto.dni,
          anio: dto.anio,
          mes: dto.mes,
          uit_valor: dto.uit_valor,
          deduccion_fija_uit: dto.deduccion_fija_uit,
          divisor_calculo: dto.divisor_calculo,
          creado_por: usuarioId,
          es_recalculo: dto.es_recalculo,
          soporte_multi_interno_id: null,
          soporte_multiempleo_id: ctx.soportes.meta.soporte_multiempleo_id ?? null,
          soporte_certificado_id: ctx.soportes.meta.soporte_certificado_id ?? null,
          soporte_sin_previos_id: ctx.soportes.meta.soporte_sin_previos_id ?? null,
          fuente_previos: ctx.fuentePrevios,
          ingresos_previos_internos: ctx.soportes.meta.ingresos_previos_internos,
          ingresos_previos_externos: ctx.soportes.meta.ingresos_previos_externos,
          ingresos_previos_acum_filial_actual: dto.ingresos_previos_acum,
          remuneracion_mensual_filial_actual: dto.remuneracion_mensual,
          bonos: ctx.base.bonos,
          asignacion_familiar: ctx.base.asignacion_familiar_mes || 0,
          grati_julio_pagada: ctx.base.gratiJulioTrabajador,
          grati_diciembre_pagada: ctx.base.gratiDiciembreTrabajador,
          grati_pagadas_otras: ctx.base.grati_multi?.pagadas_total_otras || 0,
          asignacion_familiar_total_otras: ctx.base.af_multi?.previos_total_otras || 0,
          grati_julio_proj: ctx.base.gratiJulioProj,
          grati_diciembre_proj: ctx.base.gratiDiciembreProj,
          otros_ingresos_proj: dto.otros_ingresos_proj,
          asignacion_familiar_proj: ctx.base.asignacion_familiar_proj,
          remu_proj_total_otras: ctx.base.remu_multi?.proyeccion_total_otras || 0,
          grati_proj_total_otras: (ctx.base.grati_multi?.proyeccion_total_otras.julio + ctx.base.grati_multi?.proyeccion_total_otras.diciembre) || 0,
          asignacion_familiar_proj_otras: ctx.base.af_multi?.proyeccion_total_otras || 0,
          origen_retencion: ctx.soportes.meta.origen_retencion,
          retenciones_previas_internas: ctx.soportes.meta.retenciones_previas_internas,
          retenciones_previas_externas: ctx.soportes.meta.retenciones_previas_externas,
          retenciones_previas_filial_actual: ctx.retencionesPrevias,
          extra_gravado_mes: dto.extra_gravado_mes,
          retencion_adicional_mes: dto.retencion_adicional_mes,
          bruto_anual_proyectado: dto.bruto_anual_proyectado,
          renta_neta_anual: dto.renta_neta_anual,
          impuesto_anual: dto.impuesto_anual,
          retencion_base_mes: dto.retencion_base_mes,
          tramos_usados_json: {
            impuestoTotal: dto.impuesto_anual,
            tramos_usados: dto.tramos_usados
          },
        };

        let saved;
        if (existente) {
          saved = await recalcularUC.execute({
            id: existente.id,
            overrideInput: payload,
            creadoPor: usuarioId,
            transaction: t
          });
        } else {
          saved = await guardarUC.execute(payload, {
            esRecalculo: false,
            tramos_usados_json: {
              impuestoTotal: dto.impuesto_anual,
              tramos_usados: dto.tramos_usados
            },
            transaction: t
          });
        }

        await t.commit();

        results.push({
          trabajadorId: ctx.trabajadorId,
          dni: ctx.dni,
          ok: true,
          retencion_base_mes: Number(dto.retencion_base_mes || 0),
          id_calculo: saved?.id ?? saved?.toJSON?.()?.id ?? null,
          updated: !!existente
        });

      } catch (e) {
        if (t) await t.rollback();
        results.push({
          trabajadorId: Number(row.trabajador_id),
          dni: String(row.dni || ''),
          ok: false,
          message: e?.message || 'Error',
        });
      }
    }

    const okCount = results.filter(r => r.ok).length;
    return {
      meta: {
        anio, mes, filialId,
        procesados: results.length,
        exitosos: okCount,
        fallidos: results.length - okCount,
        ms: Date.now() - startedAt,
      },
      results,
    };
  }
}

module.exports = ProcesarMasivoFilialQuinta;