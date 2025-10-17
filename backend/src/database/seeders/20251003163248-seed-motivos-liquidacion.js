'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "motivos_liquidacion",
      [
        {
          id: 1,
          codigo: "01",
          descripcion_corta: "RENUNCIA",
          descripcion_larga: "RENUNCA",
        },
        {
          id: 2,
          codigo: "02",
          descripcion_corta: "RENUNCIA CON INCENTIVOS",
          descripcion_larga: "RENUNCIA CON INCENTIVOS",
        },
        {
          id: 3,
          codigo: "03",
          descripcion_corta: "DESPIDO O DESTITUCIÓN",
          descripcion_larga: "DESPIDO O DESTITUCIÓN",
        },
        {
          id: 4,
          codigo: "04",
          descripcion_corta: "CESE COLECTIVO",
          descripcion_larga: "CESE COLECTIVO",
        },
        {
          id: 5,
          codigo: "05",
          descripcion_corta: "JUBILACIÓN",
          descripcion_larga: "JUBILACIÓN",
        },
        {
          id: 6,
          codigo: "06",
          descripcion_corta: "INVALIDEZ ABSOLUTA PERMAN",
          descripcion_larga: "INVALIDEZ ABSOLUTA PERMANENTE",
        },
        {
          id: 7,
          codigo: "07",
          descripcion_corta: "TERMIN OBRA/SERV, CUMPLIM CONDIC RESOL. O VENC PLAZO",
          descripcion_larga: "TERMINACIÓN DE LA OBRA O SERVICIO, CUMPLIMIENTO CONDICIÓN RESOLUTORIA O VENCIMIENTO DEL PLAZO",
        },
        {
          id: 8,
          codigo: "08",
          descripcion_corta: "MUTUO DISENSO",
          descripcion_larga: "MUTUO DISENSO",
        },
        {
          id: 9,
          codigo: "09",
          descripcion_corta: "FALLECIMIENTO",
          descripcion_larga: "FALLECIMIENTO",
        },
        {
          id: 10,
          codigo: "10",
          descripcion_corta: "SUSPENSIÓN DE LA PENSIÓN",
          descripcion_larga: "SUSPENSIÓN DE LA PENSIÓN",
        },
        {
          id: 11,
          codigo: "11",
          descripcion_corta: "REASIGNACIÓN",
          descripcion_larga: "REASIGNACIÓN SERVIDOR DE LA ADMINISTRACIÓN PÚBLICA",
        },
        {
          id: 12,
          codigo: "12",
          descripcion_corta: "PERMUTA",
          descripcion_larga: "PERMUTA SERVIDOR DE LA ADMINISTRACIÓN PÚBLICA",
        },
        {
          id: 13,
          codigo: "13",
          descripcion_corta: "TRANSFERENCIA",
          descripcion_larga: "TRANSFERENCIA SERVIDOR DE LA ADMINISTRACIÓN PÚBLICA",
        },
        {
          id: 14,
          codigo: "14",
          descripcion_corta: "BAJA POR SUC. EN POSIC DEL EMPLEADOR",
          descripcion_larga: "BAJA POR SUCESIÓN EN POSICIÓN DEL EMPLEADOR",
        },
        {
          id: 15,
          codigo: "15",
          descripcion_corta: "EXTINCIÓN O LIQUID. DEL EMPLEADOR",
          descripcion_larga: "BAJA POR SUCESIÓN EN POSICIÓN DEL EMPLEADOR",
        },
        {
          id: 16,
          codigo: "16",
          descripcion_corta: "OTR MOTIV CADUC PENSIÓN",
          descripcion_larga: "OTROS MOTIVOS DE CADUCIDAD DE LA PENSIÓN",
        },
        {
          id: 17,
          codigo: "17",
          descripcion_corta: "NO SE INICIÓ LA REL.  LABORAL O PREST. DE SERVICIOS",
          descripcion_larga: "NO SE INICIÓ LA RELACIÓN LABORAL O PRESTACIÓN EFECTIVA DE SERVICIOS",
        },
        {
          id: 18,
          codigo: "18",
          descripcion_corta: "LÍMITE DE EDAD 70 AÑOS",
          descripcion_larga: "LÍMITE DE EDAD 70 AÑOS",
        },
        {
          id: 19,
          codigo: "19",
          descripcion_corta: "OTRAS CAUSALES - LEY 30057",
          descripcion_larga: "OTRAS CAUSALES RÉGIMEN PÚBLICO GENERAL SERVICIO CIVIL - LEY 30057",
        },
        {
          id: 20,
          codigo: "20",
          descripcion_corta: "INHABILITAC. PARA EJERC. PROF. O FUNC. PÚB. POR MÁS DE 3 MESES - LEY 30057",
          descripcion_larga: "INHABILITACIÓN PARA EL EJERCICIO PROFESIONAL O DE LA FUNCIÓN PÚBLICA POR MÁS DE TRES MESES - LEY 30057",
        },
        {
          id: 21,
          codigo: "99",
          descripcion_corta: "SVL -HABILITADO PARA PDT PLAME",
          descripcion_larga: "SIN VÍNCULO LABORAL - HABILITADO PARA PDT PLAME",
        }
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('motivos_liquidacion', null, {});
  }
};
