//const { numeroALetras } = require(".../utils/numeroALetras"); // si ya tienes función para monto en letras
const moment = require("moment");
const db = require("../../../../../database/models");
const SequelizeAdelantoSueldoRepository = require("../../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const { redondear2 } = require("../../../../../shared/utils/redondear2");

const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

async function pdfFooter({ contrato_id, trabajador, detalles_liquidacion }) {



    const hoy = moment().format("YYYY-MM-DD");

    const contratoEncontrado = await db.contratos_laborales.findByPk(contrato_id, {
        include: [
            {
                model: db.empresas_proveedoras,
                as: "empresa_proveedora",
            }
        ]
    });

   const nombre_empresa = contratoEncontrado.empresa_proveedora.razon_social;

  const fechaTexto = moment(hoy).format("DD [de] MMMM [del] YYYY");
  const fechaFirma = moment(hoy).format("DD/MM/YYYY");

  const montoTexto = ""; // Ej: "Un mil trescientos ochenta con 39/100"

   const { informacionLiquidacion, ctsTrunca, vacacionesTrunca, gratificacionTrunca, remuneracion_trunca } = detalles_liquidacion;

  const totalCtsTrunca = ctsTrunca?.total || 0;
  const totalVacacionesTrunca = vacacionesTrunca?.total || 0;
  const totalGratificacionTrunca = gratificacionTrunca?.total || 0;
  const totalRemuneracionTrunca = remuneracion_trunca?.total || 0;

  const subtotalAPagar = redondear2(totalCtsTrunca + totalVacacionesTrunca + totalGratificacionTrunca + totalRemuneracionTrunca);


  //* Calcular si tiene adelantos por pagar
  const adelantosPagar = await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(trabajador.id)

  const adelantosPagarFormateado = adelantosPagar.map(adelanto => adelanto.get({ plain: true }));

  const adelantosSimple = adelantosPagarFormateado.filter(adelanto => adelanto.tipo === 'simple') || [];
  const adelantosGratificacion = adelantosPagarFormateado.filter(adelanto => adelanto.tipo === 'gratificacion') || [];
  const adelantosCts = adelantosPagarFormateado.filter(adelanto => adelanto.tipo === 'cts') || [];

  const calcularTotalAdelantosSimples = (adelantos) => {
    return adelantos.reduce(
      (total, adelanto) =>
        total +
        ((Number.parseFloat(adelanto.monto) || 0) /
          (Number(adelanto.cuotas)) * (Number(adelanto.cuotas) - Number(adelanto.cuotas_pagadas))),
      0
    ) || 0;
  };

  const totalAdelantosSimp = calcularTotalAdelantosSimples(adelantosSimple);
  const totalAdelantosGrati = calcularTotalAdelantosSimples(adelantosGratificacion);
  const totalAdelantos_cts = calcularTotalAdelantosSimples(adelantosCts);

  const totalAdelantosSimple = redondear2(totalAdelantosSimp);
  const totalAdelantosGratificacion = redondear2(totalAdelantosGrati);
  const totalAdelantosCts = redondear2(totalAdelantos_cts);

  const totalFinal = redondear2(subtotalAPagar - totalAdelantosSimple - totalAdelantosGratificacion - totalAdelantosCts);

  return [
    // Texto de recibí
    {
      text: [
        { text: `Recibí de la empresa ${nombre_empresa}, ` },
        { text: `el importe de ${montoTexto} soles, ` },
        { text: `(S/ ${totalFinal}), ` },
        { text: `por concepto de mis beneficios sociales, sin nada que reclamar firmo el presente documento del ${fechaFirma}. ` },
        { text: `Firmo la presente liquidación, dando fe de lo mencionado al ${fechaFirma}\n`, bold: false },
        { text: `El pago se realizará mediante transferencia bancaria a su cuenta del trabajador y/o cheque.`, bold: true },
      ],
      alignment: "justify",
      margin: [0, 20, 0, 40],
    },
    // Línea de firma
    {
      columns: [
        { width: "*", text: "" },
        {
          width: "auto",
          stack: [
            { text: "_____________________________", alignment: "center" },
            { text: `${trabajador.nombre}`, alignment: "center", bold: true },
            { text: `DNI: ${trabajador.dni}`, alignment: "center", bold: true },
          ],
        },
        { width: "*", text: "" },
      ],
      margin: [0, 40, 0, 0],
    },
  ];
}

module.exports = { pdfFooter };
