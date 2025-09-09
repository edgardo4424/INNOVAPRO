const { Op } = require("sequelize");

const { Trabajador } = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const { ContratoLaboral } = require("../../../contratos_laborales/infraestructure/models/contratoLaboralModel");

module.exports = async function enriquecerConContratoOFalla(req) {
  // Helpers de fecha
  const pad2 = (n) => String(n).padStart(2, "0");
  const ymd  = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  function periodoMes(anio, mes) {
    const A = Number(anio), M = Number(mes);
    if (!Number.isInteger(A) || !Number.isInteger(M) || M < 1 || M > 12) {
      const err = new Error(`periodoMes inválido: anio=${anio}, mes=${mes}`);
      err.status = 400; return err;
    }
    const desdeDate = new Date(A, M - 1, 1); // 1er día
    const hastaDate = new Date(A, M, 0);     // último día (28/29/30/31 correcto)
    return { desde: ymd(desdeDate), hasta: ymd(hastaDate) };
  }

  try {
    const { dni, anio, mes, trabajadorId: trabajadorIdBody, filialId } = req.body || {};

    if (!dni && !trabajadorIdBody) {
      const err = new Error("Debe enviar dni o trabajadorId"); err.status = 400; return err;
    }

    if(!anio || !mes) {
      const err = new Error("anio y mes son obligatorios"); err.status = 400; return err;
    }

    // Fechas del período
    const rango = periodoMes(anio, mes);
    if (rango instanceof Error) return rango;
    const { desde, hasta } = rango;

    // 1) Ubicamos al trabajador (por DNI o id)
    const trabajador = trabajadorIdBody
      ? await Trabajador.findOne({ where: { id: trabajadorIdBody, estado: 1 } })
      : await Trabajador.findOne({ where: { numero_documento: dni, estado: 1 } })

    console.log("UBICAMOS AL TRABAJADOR: ", trabajador.toJSON())
    if (!trabajador) {
      const err = new Error("Trabajador no encontrado"); err.status = 404; return err;
    }

    if (trabajador.asignacion_familiar !== "") {
      req.body.__tiene_asignacion_familiar = true;
      req.body.__asignacion_familiar_desde = trabajador.asignacion_familiar;
    }

    const baseWhere = {
      trabajador_id: trabajador.id,
      estado: 1,
      [Op.and]: [
        { fecha_inicio: { [Op.lte]: hasta } }, // empezó antes o en el fin del mes
        { [Op.or]: [
            { fecha_fin: null },               // sin fin
            { fecha_fin: { [Op.gte]: desde } } // o no terminó antes de empezar el mes
          ] }
      ]
    };

    // 2) Si llega filialId explícito elegimos el contrato vigente de esa filial
    if (filialId != null) {
      const filialNum = Number(filialId);
      const contrato = await ContratoLaboral.findOne({
        where: { ...baseWhere, filial_id: filialNum },
        order: [["sueldo", "DESC"], ["fecha_inicio", "DESC"], ["id", "DESC"]],
      });
      //console.log("ENCONTRAMOS EL CONTRATO VIGENTE DE LA FILIAL: ", filialId, "=", contrato.toJSON())
      if (!contrato) {
        const err = new Error("No existe contrato vigente para la filial indicada en el período");
        err.status = 400;
        return err;
      }
      req.body.__trabajadorId = trabajador.id;
      req.body.__contratoId = contrato.id;
      req.body.__filialId = contrato.filial_id;
      req.body.remuneracionMensualActual = Number(contrato.sueldo || 0);
      if(!req.body.dni) req.body.dni = trabajador.numero_documento;
      console.log("ENRIQUECIMOS EL REQBODY CON EL CONTRATO: ", req.body)
      // Si lo encontramos salimos
      return null;
    } 
    
    // 3) Automático (contrato vigente)
    const contratoVigente = await ContratoLaboral.findOne({
      where: baseWhere,
      order: [["sueldo", "DESC"], ["id", "DESC"]],
    });
    console.log("ENCONTRAMOS AUTOMATICAMENTE EL CONTRATO VIGENTE SI NO VIENE FILIALID: ", contratoVigente.toJSON())
    if (!contratoVigente) {
      const err = new Error("No existe contrato vigente para el período"); 
      err.status = 400;
      return err;
    }
    req.body.__trabajadorId = trabajador.id;
    req.body.__contratoId = contratoVigente.id;
    req.body.__filialId = contratoVigente.filial_id;
    req.body.remuneracionMensualActual = Number(contratoVigente.sueldo || 0);
    if (!req.body.dni) req.body.dni = trabajador.numero_documento;
    console.log("ENRIQUECIMOS EL REQBODY CON EL CONTRATO: ", req.body)
    // Si lo encontramos salimos
    return null;
  } catch (e) {
    console.error("Error en enriquecerConContratoOFalla:", e);
    const err = new Error(e.message || "Error interno");
    err.status = e.status || 500;
    return err;
  }
};