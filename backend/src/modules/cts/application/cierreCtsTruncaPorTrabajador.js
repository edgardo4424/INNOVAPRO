
const moment = require("moment");
const { mapearParaRegistrarTablaCts } = require("../infraestructure/services/mapearParaRegistrarTablaCts");

module.exports = async (
  usuario_cierre_id,
  filial_id,
  trabajador_id,
  fecha_baja,
  ctsRepository,
  transaction = null
) => {

    console.log({
        usuario_cierre_id,
        filial_id,
        trabajador_id,
        fecha_baja
    });
  let anio = moment(fecha_baja).format("YYYY");
  let mes = moment(fecha_baja).format("MM");

  // Determinar periodo CTS según fecha de baja
  // Mayo: computa de Noviembre (año anterior) a Abril
  // Noviembre: computa de Mayo a Octubre
  let periodo;

if (mes >= 5 && mes <= 10) {
  // Entre mayo y octubre
  periodo = "NOVIEMBRE";
} else {
  // Entre noviembre y abril
  periodo = "MAYO";
}

let anioDeposito = anio;

if (periodo === "MAYO" && mes >= 11) {
  // Si es noviembre o diciembre, el depósito de CTS será en mayo del año siguiente
  anioDeposito = parseInt(anio) + 1;
}
console.log('periodo', periodo);
console.log('anioDeposito', anioDeposito);
  // Verificar si ya hay un registro en cierres_CTS
  const cierreCTS = await ctsRepository.obtenerCierreCts(
    periodo,
    anioDeposito,
    filial_id,
    transaction
  );

  console.log('cierreCTS', cierreCTS);
  let cierreId;
  if (!cierreCTS) {
    // Registrar el registro de la tabla cierres_CTS
    const dataCierreCTS = {
      filial_id,
      periodo: `${anioDeposito}-${periodo === "MAYO" ? "05" : "11"}`, // ejemplo de mapeo
      locked_at: null, // Se mantiene en null porque es cierre individual
      usuario_cierre_id,
    };

    console.log('dataCierreCTS', dataCierreCTS);

    const nuevoCierreCTS = await ctsRepository.generarRegistroCierrePeriodoCts(
      dataCierreCTS,
      transaction
    );

    console.log("nuevoCierreCTS", nuevoCierreCTS);

    cierreId = nuevoCierreCTS.id;
  } else {
    cierreId = cierreCTS.id;
  }

  // Validar si el cierre ya fue bloqueado
  if (cierreCTS?.locked_at) {
    return {
      codigo: 400,
      respuesta: { mensaje: "La CTS ya fue cerrada" },
    };
  } else {
    console.log('entre else');
    // Registrar la CTS del trabajador
    const ctsDelTrabajador = await ctsRepository.calcularCtsIndividualTrunca(
      periodo,
      anioDeposito,
      filial_id,
      trabajador_id,
      transaction
    );


    console.log('ctsDelTrabajador', ctsDelTrabajador);

    // Verificar si hay CTS para registrar
    if (ctsDelTrabajador.length === 0) {
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay CTS del trabajador" },
      };
    }

    const dataCTS = mapearParaRegistrarTablaCts(
      ctsDelTrabajador,
      periodo,
      anioDeposito,
      filial_id,
      usuario_cierre_id,
      cierreId
    );

    console.log('dataCTS', dataCTS);
    await ctsRepository.insertarVariasCts(dataCTS, transaction);
  }

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Se registró la CTS del trabajador exitosamente",
    },
  };
};
