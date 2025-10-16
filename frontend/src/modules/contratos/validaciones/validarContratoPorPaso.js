// Reglas de validación por PASO para el Wizard de Contratos.
// paso: 1..5 (Origen, Condiciones Legales, Cronograma & Garantías, Firmas, Revisión/Envío)
// datos: formData completo del contrato (incluye la cotización origen)

const isEmail = (v = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export default function validarContratoPorPaso(paso, datos) {
  const errores = {};
  console.log("DATOS EN VALIDACIONES:", datos)
  const { cotizacion = {}, legales = {}, valorizacion = {}, firmas = {}, envio = {} } = datos || {};

  // Paso 1: Origen (Cotización)
  if (paso === 1) {
    if (!cotizacion.id) errores.cotizacion_id = "Debes seleccionar una cotización válida.";
    if (!cotizacion.entidad.cliente.ruc)
      errores.cliente_id = "La cotización debe tener cliente.";
    if (!cotizacion.entidad.obra.nombre)
      errores.obra_id = "La cotización debe tener una obra.";
    if (!cotizacion.entidad.filial.ruc)
      errores.filial_id = "La cotización debe pertenecer a una filial.";
  }

  // Paso 2: Condiciones Legales
  if (paso === 2) {
    const { vigencia = {}, clausulas = [] } = legales;

    if (!vigencia.inicio) errores.vigencia_inicio = "Indica la fecha de inicio.";
    if (!vigencia.fin) errores.vigencia_fin = "Indica la fecha de fin.";
    if (vigencia.inicio && vigencia.fin) {
      const ini = new Date(vigencia.inicio);
      const fin = new Date(vigencia.fin);
      if (fin < ini) errores.vigencia_rango = "La fecha fin no puede ser menor a la fecha inicio.";
    }

    if (!Array.isArray(clausulas) || clausulas.length === 0)
      errores.clausulas = "Agrega al menos una cláusula.";
    else if (clausulas.some((c) => !c?.titulo || !c?.texto))
      errores.clausulas_incompletas = "Hay cláusulas sin título o sin texto.";
  }

  // Paso 3: Valorización
  if (paso === 3) {
    const {
      renovaciones,
      requiere_adelantada
    } = valorizacion;

    if (!requiere_adelantada)
      errores.requiere_adelantada = "Indica si requiere valorización adelantada";
    
    if (!renovaciones)
      errores.renovaciones = "Indica el período para las renovaciones.";
  }

  // Paso 4: Firmas
  if (paso === 4) {
    const { } = firmas;

  }

  // Paso 5: Revisión y Envío
  if (paso === 5) {
    const { enviar_correo, destinatarios = [], asunto, cuerpo } = envio;

    if (enviar_correo) {
      if (!Array.isArray(destinatarios) || destinatarios.length === 0)
        errores.destinatarios = "Agrega al menos un destinatario.";
      else if (destinatarios.some((e) => !isEmail(e)))
        errores.destinatarios_invalidos = "Hay correos con formato inválido.";

      if (!asunto?.trim()) errores.asunto = "Escribe un asunto para el correo.";
      if (!cuerpo?.trim()) errores.cuerpo = "Escribe el cuerpo del correo.";
    }
  }

  return errores;
}