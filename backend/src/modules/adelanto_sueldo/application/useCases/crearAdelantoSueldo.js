const AdelantoSueldo = require("../../domain/entities/adelanto_sueldo");
const moment = require("moment"); // Asegúrate de tenerlo instalado: npm i moment
require("moment/locale/es"); // Importa el locale español

moment.locale("es");

module.exports = async (
  adelantoSueldoData,
  adelantoSueldoRepository,
  contratoLaboralRepository
) => {
  const adelanto_sueldo = new AdelantoSueldo(adelantoSueldoData);
  const errores = adelanto_sueldo.validarCamposObligatorios();
  if (errores.length > 0) {
    return { codigo: 400, respuesta: { mensaje: errores } };
  }
  const dataConstruida = adelanto_sueldo.construirDatosAdelantoSueldo();

  // Validar el ultimo contrato vigente del trabajador

  const contrato_laboral =
    await contratoLaboralRepository.obtenerUltimoContratoVigentePorTrabajadorId(
      dataConstruida.trabajador_id
    );

  if (!contrato_laboral) {
    return {
      codigo: 400,
      respuesta: { mensaje: ["No existe contrato vigente para el trabajador"] },
    };
  }

  // Validar que la fecha de primera_cuota este entre el rango del contrato vigente

  const cuota = moment(dataConstruida.primera_cuota);
  const inicio = moment(contrato_laboral.fecha_inicio);
  const fin = moment(contrato_laboral.fecha_fin);

  if (cuota.isBefore(inicio) || cuota.isAfter(fin)) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: [
          `La fecha de primera_cuota debe estar entre el rango del contrato vigente. La fecha de inicio es ${inicio.format(
            "DD-MMMM-YYYY"
          )} y la fecha de fin es ${fin.format("DD-MMMM-YYYY")}.`,
        ],
      },
    };
  }

  const nuevo_adelanto_sueldo =
    await adelantoSueldoRepository.crearAdelantoSueldo(dataConstruida);
  return {
    codigo: 201,
    respuesta: {
      mensaje: "Adelento de sueldo creado exitosamente",
      adelanto_sueldo: nuevo_adelanto_sueldo,
    },
  };
};
