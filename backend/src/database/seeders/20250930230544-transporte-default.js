'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Transportistas
    await queryInterface.bulkInsert("transportistas", [
      {
        id: 1,
        nro_doc: "20612454249",
        razon_social: "EMTRANSCAR NOW E.I.R.L.",
        nro_mtc: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nro_doc: "20607663549",
        razon_social: "TRANSPORTES VILCHEZ CARGO EXPRES S.A.C.",
        nro_mtc: "15145209CNG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nro_doc: "99999999999",
        razon_social: "CARROS INTERNOS",
        nro_mtc: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);


    // 2 Choferes
    await queryInterface.bulkInsert("choferes", [
      { id: 1, nombres: "ANDRU RICHARD", apellidos: "CARDENAS CASTRO", nro_licencia: "Q76924475", nro_doc: "76924475", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombres: "RICHARD JOHN", apellidos: "CARDENAS LUDEÑA", nro_licencia: "Q80454007", nro_doc: "Q80454007", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nombres: "LAMBERTO", apellidos: "VILCHEZ RAMOS", nro_licencia: "Q08790242", nro_doc: "08790242", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, nombres: "JAVIER ALBERTO", apellidos: "VILCHEZ SOSA", nro_licencia: "Q44861765", nro_doc: "44861765", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 5, nombres: "JOHN ALBERTO", apellidos: "VILCHEZ SOSA", nro_licencia: "Q41660431", nro_doc: "41660431", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 6, nombres: "JARLEY", apellidos: "GUIMAC ACOSTA", nro_licencia: "Q41114236", nro_doc: "41114236", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
      { id: 7, nombres: "PAUL MAYER", apellidos: "RENGIFO RENGIFO", nro_licencia: "Q44787232", nro_doc: "44787232", tipo_doc: "1", createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 3️⃣ Vehiculos
    await queryInterface.bulkInsert("vehiculos", [
      { id: 1, nro_placa: "AFK746", marca: "DONG FENG", color: "BLANCO/CELESTE /GRIS /AZUL", tuce_certificado: "", id_transportista: 1, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nro_placa: "B4M873", marca: "MITSUBISHI", color: "BLANCO AZUL CELESTE GRIS", tuce_certificado: "", id_transportista: 1, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nro_placa: "AEM894", marca: "DFSK", color: "AZUL", tuce_certificado: "", id_transportista: 1, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, nro_placa: "D7T863", marca: "YUEJIN", color: "PLATA BLANCO", tuce_certificado: "", id_transportista: 1, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },

      { id: 5, nro_placa: "D4H701", marca: "MITSUBISHI", color: "BLANCO", tuce_certificado: "", id_transportista: 2, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, nro_placa: "F6N841", marca: "JAC", color: "ROJO", tuce_certificado: "", id_transportista: 2, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, nro_placa: "C4N919", marca: "YUEJIN", color: "BLANCO", tuce_certificado: "", id_transportista: 2, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, nro_placa: "F8B875", marca: "JAC", color: "AZUL", tuce_certificado: "", id_transportista: 2, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, nro_placa: "COZ896", marca: "NISSAN", color: "BEIGE METALICO", tuce_certificado: "", id_transportista: 2, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },

      // en tu JSON tenían id_transportista = 13, lo cambié a 3 (existe)
      { id: 10, nro_placa: "ASH901", marca: "CHEVROLET", color: "BLANCO CRESCENT", tuce_certificado: "", id_transportista: 3, id_chofer: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 11, nro_placa: "D3D809", marca: "HINO", color: "BLANCO VERDE ROJO NEGRO", tuce_certificado: "", id_transportista: 3, id_chofer: 7, createdAt: new Date(), updatedAt: new Date() },
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vehiculos", null, {});
    await queryInterface.bulkDelete("choferes", null, {});
    await queryInterface.bulkDelete("transportistas", null, {});
  },
};
