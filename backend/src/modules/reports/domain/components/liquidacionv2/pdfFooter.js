//const { numeroALetras } = require(".../utils/numeroALetras"); // si ya tienes función para monto en letras
const moment = require("moment");
const db = require("../../../../../database/models");
const SequelizeAdelantoSueldoRepository = require("../../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const { redondear2 } = require("../../../../../shared/utils/redondear2");
const { numeroALeyenda } = require("../../../../../shared/utils/numeroALeyenda");
const { capitalizarPrimeraLetra } = require("../../../../../shared/utils/capitalizarPrimeraLetra");

const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

async function pdfFooter({ filial_id, trabajador, detalles_liquidacion }) {



    const hoy = moment().format("YYYY-MM-DD");

    const filialEncontrado = await db.empresas_proveedoras.findByPk(filial_id);

   const nombre_empresa = filialEncontrado.razon_social;

  const fechaTexto = moment(hoy).format("DD [de] MMMM [del] YYYY");
  const fechaFirma = moment(hoy).format("DD/MM/YYYY");


   const { informacionLiquidacion, ctsTrunca, vacacionesTrunca, gratificacionTrunca, remuneracion_trunca, descuentos_adicionales } = detalles_liquidacion;

  const totalCtsTrunca = ctsTrunca?.total || 0;
  const totalVacacionesTrunca = vacacionesTrunca?.total || 0;
  const totalGratificacionTrunca = gratificacionTrunca?.total || 0;
  const totalRemuneracionTrunca = remuneracion_trunca?.total || 0;

  const subtotalAPagar = redondear2(totalCtsTrunca + totalVacacionesTrunca + totalGratificacionTrunca + totalRemuneracionTrunca);

   const totalAdelantosSimple = descuentos_adicionales?.totalAdelantosSimple || 0
  const totalAdelantosGratificacion = descuentos_adicionales?.totalAdelantosGratificacion || 0
  const totalAdelantosCts = descuentos_adicionales?.totalAdelantosCts || 0

  const totalFinal = redondear2(subtotalAPagar - totalAdelantosSimple - totalAdelantosGratificacion - totalAdelantosCts);

  const montoTexto = capitalizarPrimeraLetra(numeroALeyenda(totalFinal))

  return [
    // Texto de recibí
    {
       style: 'parrafo',
      text: [
        { text: `Recibí de la empresa ` },
        { text: `${nombre_empresa} `, bold: true },
        { text: `el importe de ${montoTexto} soles, ` },
        { text: `(S/ ${totalFinal.toFixed(2)}), ` },
        { text: `por concepto de mis beneficios sociales, sin nada que reclamar, firmo el presente documento del ${fechaTexto}. ` },
        { text: `Firmo la presente liquidación, dando fe de lo mencionado al ${fechaFirma}.\n`, bold: false },
        { text: `El pago se realizará mediante transferencia bancaria a su cuenta del trabajador y/o cheque.`, bold: true },
      ],
     /*  alignment: "justify",
      margin: [0, 20, 0, 40], */
       fontSize: 7,
    },
    // Línea de firma
    {
 
      columns: [
        { width: "*", text: "" },
        {
          width: "auto",
          stack: [
            { text: "_____________________________", alignment: "center",  margin: [0, 2, 0, 2] },
            { text: `${trabajador.nombres} ${trabajador.apellidos}`, alignment: "center", bold: true,  margin: [0, 2, 0, 2] },
            { text: `${trabajador.tipo_documento}: ${trabajador.numero_documento}`, alignment: "center", bold: true },
          ],
          fontSize: 8
        },
        { width: "*", text: "" },
      ],
      margin: [0, 40, 0, 0],
    },
  ];
}

module.exports = { pdfFooter };
