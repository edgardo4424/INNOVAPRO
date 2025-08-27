const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");

const repo = new SequelizeCalculoQuintaCategoriaRepository();

// Si no llega remuneración, la tomamos del contrato vigente (y validamos quinta_categoria)
async function enriquecerConContratoOFalla(req) {
  const body = req.body;
  const { anio, mes, trabajadorId, dni } = body;

  // Si no viene, tomamos el contrato vigente
  const contrato = await repo.getContratoVigente({ trabajadorId, dni, anio, mes });
  
  if (!contrato) return { status: 400, message: 'No existe contrato laboral vigente para el periodo indicado.' };

  console.log("CONTRATO:" , contrato)
  req.body.__contratoId = contrato.id;
  console.log("BODY ENRIQUECIDO:", req.body)

  body.remuneracionMensualActual = Number(contrato.sueldo);
  if (!body.trabajadorId) body.trabajadorId = contrato.trabajador_id;
  if (!body.dni) body.dni = contrato.numero_documento;
  
  return null; // Retornamos null para que continúe el cálculo que utilice esta utilidad pero con el body enriquecido
}

module.exports = enriquecerConContratoOFalla;