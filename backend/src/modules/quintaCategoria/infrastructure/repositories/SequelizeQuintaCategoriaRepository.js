const { QueryTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CalculoQuintaRepository = require('../../domain/repositories/CalculoQuintaRepository');
const CalculoQuintaModel = require('../models/CalculoQuintaModel');
const CierreQuintaModel = require('../models/CierreQuintaModel');

const { num, _periodo } = require('../../shared/utils/helpers');

const _id = (x) => {
  if (x == null) return null;
  if (typeof x === 'object') return Number(x.id ?? x);
  return Number(x);
};

class SequelizeCalculoQuintaCategoriaRepository extends CalculoQuintaRepository {

  _parsePeriodoYYYYMM(fechaAnioMes) {
    if (typeof fechaAnioMes !== 'string' || !/^\d{4}-\d{2}$/.test(fechaAnioMes)) {
      const err = new Error("fechaAnioMes debe tener formato YYYY-MM");
      err.status = 400; throw err;
    }
    const [y, m] = fechaAnioMes.split('-').map(Number);
    if (m < 1 || m > 12) { const err = new Error("Mes inválido en fechaAnioMes"); err.status = 400; throw err; }
    return { anio: y, mes: m };
  }

  async obtenerMultiempleoInferido({ trabajadorId, fechaAnioMes }) {
    const _ejecutarCalculoQuinta = require('../../application/useCases/_ejecutarCalculoQuinta');

    const pad = (x) => String(x).padStart(2, '0');
    const match = String(fechaAnioMes || '').match(/^\d{4}-\d{2}$/);
    if (!match) {
      const err = new Error("fechaAnioMes debe tener formato YYYY-MM");
      err.status = 400; throw err;
    }
    const [anio, mes] = match[0].split('-').map(Number);

    // descubrir filiales desde la proyección multi
    const firstReq = {
      body: {
        anio, mes,
        periodo: `${anio}-${pad(mes)}`,
        trabajadorId,
        __trabajadorId: trabajadorId,
        fuentePrevios: 'AUTO',
      }
    };

    const { ctx: ctx0 } = await _ejecutarCalculoQuinta(firstReq);

    const detalle = ctx0?.base?.remu_multi?.detalle_por_filial || [];
    const seedFilial = Number(ctx0?.filialActualId) || null;

    const filialesSet = new Set(
      [
        ...(seedFilial ? [seedFilial] : []),
        ...detalle.map(d => Number(d.filial_id)).filter(Number.isFinite)
      ]
    );

    // Traemos (RUC, razón social) en un solo query
    const ids = Array.from(filialesSet);
    const infoByFilial = new Map();
    if (ids.length) {
      const empresas = await sequelize.query(
        `SELECT id, ruc, razon_social FROM empresas_proveedoras WHERE id IN (:ids)`,
        { type: QueryTypes.SELECT, replacements: { ids } }
      );
      for (const e of empresas) {
        infoByFilial.set(Number(e.id), { ruc: e.ruc || null, razon_social: e.razon_social || null });
      }
    }

    // determinar retentora y monto aplicable
    const resultados = [];
    for (const filialId of filialesSet) {
      const det = detalle.find(d => Number(d.filial_id) === Number(filialId));
      const contratoId = det ? Number(det.contrato_id || det.id_contrato || det.id) : null;

      const fakeReq = {
        body: {
          anio, mes,
          periodo: `${anio}-${pad(mes)}`,
          trabajadorId,
          __trabajadorId: trabajadorId,
          __filialId: Number(filialId),
          contratoId,
          __contratoId: contratoId,
          fuentePrevios: 'AUTO',
        }
      };

      try {
        const { dto, ctx } = await _ejecutarCalculoQuinta(fakeReq);
        const meta = ctx?.soportes?.meta || {};
        const esSecundaria = !!meta.es_secundaria;
        const filialRetieneId = Number(meta.filial_retiene_id ?? filialId);

        // Regla: solo la retentora reporta monto; secundarias = 0
        const monto = (esSecundaria || filialRetieneId !== Number(filialId))
          ? 0
          : Number(dto?.retencion_base_mes || 0);
          
        const info = infoByFilial.get(Number(filialId)) || { ruc: null, razon_social: null };
        resultados.push({
          filial_id: Number(filialId),
          ruc: info.ruc,
          razon_social: info.razon_social,
          monto,
        });
      } catch {
        const info = infoByFilial.get(Number(filialId)) || { ruc: null, razon_social: null };
        resultados.push({
          filial_id: Number(filialId),
          ruc: info.ruc,
          razon_social: info.razon_social,
          monto: 0,
        });
      }
    }

    resultados.sort((a, b) => a.filial_id - b.filial_id);

    return {
      trabajador_id: Number(trabajadorId),
      fecha_anio_mes: `${anio}-${pad(mes)}`,
      filiales: resultados,
    };
  }

  // CIERRES DE QUINTA
  async obtenerCierreQuinta(periodo, filial_id, transaction = null) {
    return CierreQuintaModel.findOne({ where: { periodo, filial_id }, transaction });
  }

  async insertarCierreQuinta(data, transaction = null) {
    return CierreQuintaModel.create(data, { transaction });
  }

  async actualizarCierreQuinta(id, patch, transaction = null) {
    const cierre = await CierreQuintaModel.findByPk(id, { transaction });
    if (!cierre) return null;
    await cierre.update(patch, { transaction });
    return cierre;
  }

  async listarCierres({ filialId, anio }) {
    const where = {};
    if (filialId) where.filial_id = filialId;
    if (anio) where.periodo = { [sequelize.Op.like]: `${anio}-%` };
    return CierreQuintaModel.findAll({ where, order: [['periodo', 'DESC']] });
  }

  // PARA VALIDAR
  async estaCerrado({ filialId, anio, mes, periodo }, options = {}) {
    const per = _periodo({ anio, mes, periodo });
    const where = { filial_id: num(filialId), periodo: per };
    const row = await CierreQuintaModel.findOne({
      where, attributes: ['id'], raw: true, transaction: options.transaction
    });
    return !!row;
  }

  // Insertar cálculos en tabla quinta_calculos
  async create(entity) { return await CalculoQuintaModel.create(entity); }

  async updateById(idLike, patch, options = {}) {
    const id = _id(idLike);
    if (!id || Number.isNaN(id)) {
      const e = new Error('ID inválido para updateById');
      e.status = 400; throw e;
    }
    const row = await CalculoQuintaModel.findByPk(id, { transaction: options.transaction });
    if (!row) return null;
    await row.update(patch, { transaction: options.transaction });
    return row;
  }

  // Buscamos por id en quinta_calculos
  async findById(id) { return await CalculoQuintaModel.findByPk(id); }
  // Buscamos todas las filas de un trabajador en un año ordenadas
  // de manera ascendente por mes y id
  async findByWorkerYear({ dni, trabajadorId, anio }) {
    const where = {};
    if (dni) where.dni = dni;
    if (trabajadorId) where.trabajador_id = trabajadorId;
    if (anio) where.anio = anio;
    return await CalculoQuintaModel.findAll({
      where,
      order: [['mes','ASC'],['id','ASC']]
    });
  }

  // Validador de bloqueo por mes (cierre)
  async ultimoMesCerradoPorDniAnio({ dni, anio }) {
    try {
      const filas = await CalculoQuintaModel
      .unscoped()
      .findAll({
        where: { dni, anio, fuente: 'oficial' },
        attributes: ['mes'],
        order: [['mes', 'DESC']],
        raw: true,
        transaction: options.transaction,
      })
    return filas ? Number(filas.mes) : 0;
    } catch (e) {
      return 0;
    }
  }

  // Método para ser usado por otros módulos
  async findUltimoVigentePorDniMes({ dni, anio, mes }) {
      return CalculoQuintaModel.findOne({
      where: { dni, anio, mes }, 
      order: [['createdAt', 'DESC']],     // último creado = vigente del mes
      // attributes opcionales para performance:
      // attributes: ['id','dni','anio','mes','retencion_base_mes','es_recalculo','createdAt'],
    });
  }

  // Para upsert idempotente en masivo
  async findOficialByPeriodo({ dni, anio, mes }, options = {}) {
    return CalculoQuintaModel.findOne({
      where: { dni, anio, mes, fuente: 'oficial' },
      order: [['updated_at', 'DESC'], ['created_at','DESC'], ['id','DESC']],
      transaction: options.transaction
    });
  }

  // Paginado con filtros (dni/año). Retornamos filas, el contador, las paginas y el limite
  async list({ dni, trabajadorId, anio, page=1, limit=20 }) {
    const where = {};
    if (dni) where.dni = dni;
    if (trabajadorId) where.trabajador_id = trabajadorId;
    if (anio) where.anio = anio;
    const offset = (page-1)*limit;
    const { rows, count } = await CalculoQuintaModel.findAndCountAll({
      where, offset, limit, order: [['created_at','DESC']]
    });
    const totalPages= Math.ceil(count / limit) || 1;
    return { rows, count, page, limit, totalPages};
  }

  /**
   * Contrato vigente al 15 del mes indicado.
   * Filtros:
   * - t.estado = 'activo'
   * - cl.estado = 1
   * - cl.fecha_inicio <= fechaRef
   * - (cl.fecha_fin IS NULL OR cl.fecha_fin >= fechaRef)
   * - (cl.fecha_terminacion_anticipada IS NULL OR > fechaRef)
   * Retorna: { trabajador_id, sueldo, quinta_categoria, numero_documento, ... }
   */
  async getContratoVigente({ trabajadorId, dni, anio, mes }) {
    const ymd = `${anio}-${String(mes).padStart(2,'0')}-15`; // AÑO-MES-DIA

    let sql = `
      SELECT
        cl.id,
        cl.trabajador_id,
        cl.sueldo,
        cl.fecha_inicio,
        cl.fecha_fin,
        cl.fecha_terminacion_anticipada,
        cl.estado AS estado_contrato,
        cl.filial_id,
        t.numero_documento,
        t.estado AS estado_trabajador,
        (CASE WHEN t.asignacion_familiar IS NULL THEN 0 ELSE dm.valor END) AS valor_asignacion_familiar
      FROM contratos_laborales cl
      JOIN trabajadores t ON t.id = cl.trabajador_id
      CROSS JOIN (
        SELECT CAST(valor AS DECIMAL(10,2)) AS valor
        FROM data_mantenimiento
        WHERE codigo = 'valor_asignacion_familiar'
        LIMIT 1 
      ) dm
      WHERE t.estado = 'activo'
        AND cl.fecha_inicio <= :ymd
        AND (cl.fecha_fin IS NULL OR cl.fecha_fin >= :ymd)
        AND (cl.fecha_terminacion_anticipada IS NULL OR cl.fecha_terminacion_anticipada > :ymd)
    `;

    const reps = { ymd };

    if (trabajadorId) {
      sql += ` AND cl.trabajador_id = :tid `;
      reps.tid = trabajadorId;
    } else if (dni) {
      sql += ` AND t.numero_documento = :dni `;
      reps.dni = dni;
    } else {
      return null;
    }
    // Ordenamos por sueldo, fecha de inicio y id de manera descendente
    // y limitamos a 1 (Priorizamos sueldoas más altos/contratos recientes)
    sql += ` ORDER BY cl.sueldo DESC, cl.fecha_inicio DESC, cl.id DESC LIMIT 1 `;

    const rows = await sequelize.query(sql, { type: QueryTypes.SELECT, replacements: reps });
    return rows[0] || null;
  }
}

module.exports = SequelizeCalculoQuintaCategoriaRepository;