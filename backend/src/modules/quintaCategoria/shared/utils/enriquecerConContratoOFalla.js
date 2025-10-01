const { Op } = require("sequelize");

const { Trabajador } = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const { ContratoLaboral } = require("../../../contratos_laborales/infraestructure/models/contratoLaboralModel");
const { Filial } = require('../../../filiales/infrastructure/models/filialModel')

const { periodoMes } = require("./helpers");

  // Función auxiliar para enriquecer el req body
  function _enriquecerReqBody(req, trabajador, contrato) {
    
    console.log("CONTRATO ENCONTRADO: ", {
      id: contrato?.id,
      filial_id: contrato?.filial_id,
      sueldo: contrato?.sueldo,
      ruc: contrato?.empresa_proveedora?.ruc,
      razon_social: contrato?.empresa_proveedora?.razon_social,
    });
    req.body.__trabajadorId = trabajador.id;
    req.body.__contratoId = contrato?.id;
    req.body.__filialId = contrato?.filial_id;
    req.body.remuneracionMensualActual = Number(contrato?.sueldo || 0);

    req.body.__filialRuc = contrato?.empresa_proveedora?.ruc || null;
    req.body.__filialRazonSocial = contrato?.empresa_proveedora?.razon_social || null;

    if (!req.body.dni) req.body.dni = trabajador.numero_documento;
    if (trabajador.asignacion_familiar) {
      req.body.__tiene_asignacion_familiar = true;
      req.body.__asignacion_familiar_desde = trabajador.asignacion_familiar;
    }
  }

module.exports = async function enriquecerConContratoOFalla(req) {
  try {
    const { dni, anio, mes, trabajadorId: trabajadorIdBody, filialId } = req.body || {};

    if ((!dni && !trabajadorIdBody) || !anio || !mes) {
      const err = new Error("Parámetros incompletos. Se requiere dni/trabajadorId, anio y mes."); err.status = 400; return err;
    }

    // Fechas del período extraídas de la función que formatea las fechas 'periodoMes'
    const rango = periodoMes(anio, mes);
    if (rango instanceof Error) return rango; // Si hay Error, devolvemos el objeto Error
    const { desde, hasta } = rango;

    // Ubicamos al trabajador (por DNI si existe y sino por id)
    const trabajador = trabajadorIdBody 
      ? await Trabajador.findOne({ where: { id: trabajadorIdBody, estado: 1 } })
      : await Trabajador.findOne({ where: { numero_documento: dni, estado: 1 } })

    if (!trabajador) {
      const err = new Error("Trabajador no encontrado o inactivo"); err.status = 404; return err;
    }

    const baseWhere = { // Definimos las bases de las condiciones para la consulta de la tabla contratos laborales
      trabajador_id: trabajador.id,
      estado: 1,
      [Op.and]: [
        { fecha_inicio: { [Op.lte]: hasta } }, // Buscamos contratos que hayan iniciado antes o en la fecha de fin de mes
        { [Op.or]: [
            { fecha_fin: null },               // O que no tengan fecha de fin
            { fecha_fin: { [Op.gte]: desde } } // O su fecha de fin sea después de la fecha de inicio de mes
          ] }
      ]
    }; // Así aseguramos obtener los contratos vigentes en el período especificado

    // Include para traer RUC/razón social de la filial
    const includeEmpresa = [{
      model: Filial,
      as: "empresa_proveedora",
      attributes: ["id", "ruc", "razon_social"]
    }];

    let contrato = null;
    // Si llega filialId explícito elegimos el contrato vigente de esa filial
    if (filialId != null) {
      contrato = await ContratoLaboral.findOne({
        where: { ...baseWhere, filial_id: Number(filialId) }, // Que cumpla todas las condiciones y que sea de la filial dada
        include: includeEmpresa,
        order: [["sueldo", "DESC"], ["fecha_inicio", "DESC"], ["id", "DESC"]], // POR SUELDO MAYOR, MAS RECIENTE, Y POR ULTIMO EL ID MAS ANTIGUO
        attributes: ["id", "trabajador_id", "filial_id", "sueldo"]
      });

      if (!contrato) {
        const err = new Error(`No existe contrato vigente para la filial ${filialId} en el período.`);
        err.status = 400;
        return err;
      }
    } else { // Si no buscamos los vigentes sin filtrar por filial
      const contratosVigentes = await ContratoLaboral.findAll({
        where: baseWhere,
        include: includeEmpresa,
        order: [["sueldo", "DESC"], ["fecha_inicio", "DESC"]],
        attributes: ["id", "trabajador_id", "filial_id", "sueldo"]
      });

      if (contratosVigentes.length > 1) {
        // Si hay más de un contrato elegimos el primero.
        // console.warn(`[WARN] Se encontraron múltiples contratos vigentes para el trabajador ${trabajador.id}. Usando el de mayor sueldo.`);
        contrato = contratosVigentes[0];
      } else if (contratosVigentes.length === 1) {
        contrato = contratosVigentes[0];
      } else {
        const err = new Error("No existe contrato vigente para el período.");
        err.status = 400;
        return err;
      }
    }

      _enriquecerReqBody(req, trabajador, contrato);
      // y salimos de la función
      return null;
  } catch (e) {
    console.error("Error enriqueciendo el contrato:", e);
    const err = new Error(e.message || "Error interno del servidor");
    err.status = e.status || 500;
    return err;
  }
};