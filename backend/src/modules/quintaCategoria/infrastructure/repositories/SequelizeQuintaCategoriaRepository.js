const { QueryTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CalculoQuintaRepository = require('../../domain/repositories/CalculoQuintaRepository');
const CalculoQuintaModel = require('../models/CalculoQuintaModel');

class SequelizeCalculoQuintaCategoriaRepository extends CalculoQuintaRepository {
  // Insertar cálculos en tabla quinta_calculos
  async create(entity) { return await CalculoQuintaModel.create(entity); }
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