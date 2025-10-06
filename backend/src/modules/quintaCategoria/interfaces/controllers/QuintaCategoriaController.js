// REPOSITORIOS (INFRAESTRUCTURA)
const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");

// CASOS DE USO
const GuardarCalculoQuinta = require('../../application/useCases/guardarCalculoQuinta');
const RecalcularQuinta = require('../../application/useCases/recalcularQuinta');
const ObtenerRetencionBaseMesPorDni = require('../../application/useCases/obtenerRetencionBaseMesPorDni');

// INSTANCIAS DE LOS REPOSITORIOS
const repo = new SequelizeCalculoQuintaCategoriaRepository();

// INSTANCIAS DE LOS CASOS DE USO
const guardarUC = new GuardarCalculoQuinta(repo);
const recalcularUC = new RecalcularQuinta(repo);
const obtenerBaseMesUC = new ObtenerRetencionBaseMesPorDni({ repo });

// UTILIDADES 
const { _absolutizeSoportes, _baseVacia } = require('../../shared/utils/helpers');
const { mapCalculoQuintaToResponse } = require('../../shared/mappers/mapCalculoQuintaToResponse');
// Motor de cálculo
const _ejecutarCalculoQuinta = require('../../application/useCases/_ejecutarCalculoQuinta');

module.exports = {
  async previsualizar(req, res) {
    try {
      const { dto, ctx } = await _ejecutarCalculoQuinta(req);

      // Mapeamos el formato de salida
      const response = mapCalculoQuintaToResponse(dto);
      response.warnings = ctx.warnings;

      // Entradas visibles al front 
      response.entradas = {
        ...(response.entradas || {}),
        remuneracion_mensual: ctx.remuneracionMensualActual,
        grati_julio_proj: ctx.base.gratiJulioProj,
        grati_diciembre_proj: ctx.base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otrosIngresosProj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
        ingresos_previos_acum: Number(ctx.base.total_ingresos || 0),
      }

      // Forzar el id del trabajador en la respuesta
      if (response.trabajador) {
        response.trabajador.id = Number(ctx.trabajadorId); 
      }

      // Soportes URLs absolutas
      const soportesAbs = _absolutizeSoportes(ctx.soportes, req);

      return res.status(200).json({
        ok: true,
        data: {
          ...response,
          ingresos_previos: ctx.base,
          retencion_meta: ctx.soportes.meta,
          soportes: soportesAbs
        }
      });
    } catch (error) {
      console.error("Error en previsualizar quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },

  async crear(req, res) {
    try {
      const { dto, ctx } = await _ejecutarCalculoQuinta(req);
      
      // Entradas visibles (en dto)
      dto.entradas = {
        ...(dto.entradas || {}),
        remuneracion_mensual: ctx.remuneracionMensualActual,
        grati_julio_proj: ctx.base.gratiJulioProj,
        grati_diciembre_proj: ctx.base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otrosIngresosProj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
      };

      // Datos adicionales para guardar
      const paraGuardar = {
        ...dto,
        trabajador_id: ctx.trabajadorId,
        contrato_id: req.body.__contratoId,
        filial_id: ctx.filialActualId,
        dni: ctx.dni, anio: ctx.anio, mes: ctx.mes,
        filial_retiene_id: ctx.soportes.meta.filial_retiene_id,
        origen_retencion: ctx.soportes.meta.origen_retencion,
        es_secundaria: ctx.soportes.meta.es_secundaria ? 1 : 0,
        ingresos_previos_internos: ctx.soportes.meta.ingresos_previos_internos,
        ingresos_previos_externos: ctx.soportes.meta.ingresos_previos_externos,
        retenciones_previas_externas: ctx.soportes.meta.retenciones_previas_externas,
        soporte_multiempleo_id: ctx.soportes.meta.soporte_multiempleo_id,
        soporte_certificado_id: ctx.soportes.meta.soporte_certificado_id,
        soporte_sin_previos_id: ctx.soportes.meta.soporte_sin_previos_id,
        soportes_json: ctx.soportes.meta.soportes_json,
        creado_por: req.usuario.id,
      };

      const saved = await guardarUC.execute(paraGuardar, {
        esRecalculo: false,
        fuente: 'oficial',
        tramos_usados_json: {
          impuestoTotal: dto.impuesto_anual,
          tramos_usados: dto.tramos_usados
        }
      });

      const soportesAbs = _absolutizeSoportes(ctx.soportes, req);

      return res.status(201).json({
        ok: true,
        data: {
          ...(saved.toJSON?.() ?? saved),
          ingresos_previos: ctx.base,
          retencion_meta: ctx.soportes.meta,
          soportes: soportesAbs
        }
      });
    } catch (error) {
      console.error("Error al crear registro de quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },

  async recalcular(req, res) {
    try {
      const prev = await repo.findById(req.params.id);
      if (!prev) return res.status(404).json({ ok: false, message: 'No encontrado' });

     // Validación crítica: no permitir cambiar de mes/año en un recálculo
     if (req.body?.mes && Number(req.body.mes) !== Number(prev.mes)) {
        return res.status(400).json({
          ok: false,
          message: `Este recálculo pertenece a ${prev.anio}-${String(prev.mes).padStart(2,'0')}. No puede ejecutarse para otro mes.`
        });
      }
      if (req.body?.anio && Number(req.body.anio) !== Number(prev.anio)) {
        return res.status(400).json({
          ok: false,
          message: `Este recálculo pertenece al año ${prev.anio}. No puede ejecutarse para otro año.`
        });
      }

      req.body = {
        ...req.body,
        anio: Number(prev.anio),
        mes: Number(prev.mes),
        __filialId: Number(prev.filial_id),
        filialId: Number(prev.filial_id), // el middleware también lo usa
      };

      const { dto, ctx } = await _ejecutarCalculoQuinta(req);

      // Warnings en dto para persistir snapshot si hace falta
      dto.warnings = ctx.warnings;

      // Entradas visibles
      dto.entradas = {
        ...(dto.entradas || {}),
        remuneracion_mensual: ctx.remuneracionMensualActual,
        grati_julio_proj: ctx.base.gratiJulioProj,
        grati_diciembre_proj: ctx.base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otros_ingresos_proj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
      };

      // 10) Persistir el recálculo (sólo UPDATE; no recalcular de nuevo)
      const paraGuardar = await recalcularUC.execute({
        id: req.params.id,
        overrideInput: {
          ...dto,
          trabajador_id: ctx.trabajadorId,
          filial_id: ctx.filialActualId,
          dni: ctx.dni, anio: ctx.anio, mes: ctx.mes,
          filial_retiene_id: ctx.soportes.meta.filial_retiene_id,
          origen_retencion: ctx.soportes.meta.origen_retencion,
          es_secundaria: ctx.soportes.meta.es_secundaria ? 1 : 0,
          ingresos_previos_internos: ctx.soportes.meta.ingresos_previos_internos,
          ingresos_previos_externos: ctx.soportes.meta.ingresos_previos_externos,
          retenciones_previas_externas: ctx.soportes.meta.retenciones_previas_externas,
          soporte_multiempleo_id: ctx.soportes.meta.soporte_multiempleo_id,
          soporte_certificado_id: ctx.soportes.meta.soporte_certificado_id,
          soporte_sin_previos_id: ctx.soportes.meta.soporte_sin_previos_id,
          soportes_json: ctx.soportes.meta.soportes_json,
        },
        creadoPor: req.user?.id
      });

      const soportesAbs = _absolutizeSoportes(ctx.soportes, req);

      return res.status(201).json({
        ok: true,
        data: {
          ...(paraGuardar.toJSON?.() ?? paraGuardar),
          ...dto,
          ingresos_previos: ctx.base,
          retencion_meta: ctx.soportes.meta,
          soportes: soportesAbs,
        }
      });
    } catch (error) {
      console.error("Error en el recálculo de quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al recalcular la retención de quinta categoría."
      });
    }
  },

  // CRUDs de consultas
  async getById(req, res) {
    try {
      const row = await repo.findById(req.params.id);
      if (!row) return res.status(404).json({ ok: false, message: 'No encontrado' });
      return res.json({ ok: true, data: row });
    } catch (error) {
      console.error("Error buscando el cálculo de quinta categoría:", error);
      return res.status(500).json({
        ok: false,
        message: "Error interno al buscar el cálculo de quinta categoría."
      });
    }
  },

  async list(req, res) {
    try {
      const { dni, anio, page, limit } = req.query;
      const response = await repo.list({ 
        dni, // Para filtrar por trabajador
        anio: anio ? Number(anio) : undefined, // Para filtrar por año
        page: Number(page) || 1, // Por defecto pagina 1
        limit: Number(limit) || 20 // Por defecto 20 filas por pagina
      });

      return res.json({ ok: true, ...response });
    } catch (error) {
      console.error("Error listando los cálculos de quinta categoría:", error);
      return res.status(500).json({
        ok: false,
        message: "Error interno listando los cálculos de quinta categoría."
      });
    }
  },

  async getRetencionBaseMesPorDni(req, res) {
    try {
      const { dni, anio, mes } = req.query || {};
      const out = await obtenerBaseMesUC.execute({ dni, anio: Number(anio), mes: Number(mes) });
      return res.status(200).json({ ok: true, ...out });
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({ ok: false, message: err.message || "Error interno al consultar retención base del trabajador"})
    }
  },

  async obtenerMultiempleoInferido(req, res) {
    try {
      const trabajadorId = Number(req.query.trabajador_id);
      const fecha = String(req.query.fecha_anio_mes || "");

      if (!Number.isFinite(trabajadorId) || trabajadorId <= 0) {
        return res.status(400).json({ ok: false, message: "Parámetro 'trabajador_id' inválido." });
      }

      const data = await repo.obtenerMultiempleoInferido({
        trabajadorId,
        fechaAnioMes: fecha
      });

      return res.status(200).json({ ok: true, data });
    } catch (error) {
      console.error("[QuintaCategoria] obtenerMultiempleoInferido error:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al obtener multiempleo inferido."
      });
    }
  },
};