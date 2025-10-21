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

  //* Obtener primero los contratos del trabajador
    const contratos =
      await contratoLaboralRepository.obtenerHistoricoContratosDesdeUltimaAlta(
        dataConstruida.trabajador_id
      );

      
    const contratosDelTrabajador = contratos
      .map((contrato) => contrato.get({ plain: true }))

      console.log('contratos', contratosDelTrabajador);

      console.log('adelantoSueldoData', adelantoSueldoData);

  // Validar el ultimo contrato vigente del trabajador

/*   const contrato_laboral =
    await contratoLaboralRepository.obtenerUltimoContratoVigentePorTrabajadorId(
      dataConstruida.trabajador_id
    );
 */
   /*  console.log('contrato_laboral', contrato_laboral); */

   //! OJO Los contratos estan ordenandos de forma DECRECIENTEEEEEEEEE
  const ultimoContrato = contratosDelTrabajador[0];
  const primerContrato = contratosDelTrabajador[contratosDelTrabajador.length - 1];

  if (contratosDelTrabajador.length == 0) {
    return {
      codigo: 400,
      respuesta: { mensaje: ["El trabajador no tiene contrato"] },
    };
  }

  // Validar que la fecha de primera_cuota este entre el rango del contrato vigente

  const cuota = moment(dataConstruida.primera_cuota);
  const inicio = moment(primerContrato.fecha_inicio);
  const fin = moment(ultimoContrato.fecha_fin);

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
