'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "cargos_sunat",
      [
        {
          id: 1,
          nombre: "GERENTE GENERAL, EMPRESA/SERVICIO DE EMPRESA",
          codigo: "127027",
        },
         {
          id: 2,
          nombre: "GERENTE DE ADMINISTRACION",
          codigo: "137005",
        },
        {
          id: 3,
          nombre: "GERENTE DE COMERCIALIZACION",
          codigo: "139010",
        },
        {
          id: 4,
          nombre: "JEFE DE ALMACEN",
          codigo: "411002",
        },
        {
          id: 5,
          nombre: "AUXILIAR DE OFICINA",
          codigo: "462001",
        },
        {
          id: 6,
          nombre: "VENDEDOR, TECNICO",
          codigo: "375018",
        },
        {
          id: 7,
          nombre: "ELEVADORISTA DE CARGA",
          codigo: "877010",
        },
         {
          id: 8,
          nombre: "MONTADOR DE ANDAMIOS",
          codigo: "868010",
        },
        {
          id: 9,
          nombre: "ALMACENERO",
          codigo: "421001",
        },
          {
          id: 10,
          nombre: "SOLDADOR CON SOPLETE Y POR ARCO ELECTRICO,GRAL",
          codigo: "785034",
        },
        {
          id: 11,
          nombre: "AUXILIAR DE OFICINA",
          codigo: "462001",
        },
        {
          id: 12,
          nombre: "INGENIERO CIVIL",
          codigo: "219001",
        },
        {
          id: 13,
          nombre: "ABOGADO",
          codigo: "254001",
        },
        {
          id: 14,
          nombre: "GERENTE GENERAL, EMPRESA/CONSTRUCCION Y OBRAS PUBLICAS",
          codigo: "123004",
        },
        {
          id: 15,
          nombre: "GERENTE DE COMERCIALIZACION",
          codigo: "139010",
        },
        {
          id: 16,
          nombre: "TECNICO, ELECTRICISTA",
          codigo: "313001",
        },
        {
          id: 17,
          nombre: "ELEVADORISTA DE CARGA",
          codigo: "877010",
        },
        {
          id: 18,
          nombre: "MONTADOR DE ANDAMIOS",
          codigo: "868010",
        },
        {
          id: 19,
          nombre: "PROGRAMADOR, INFORMATICA/ANALISIS DE SISTEMAS",
          codigo: "319008",
        },
        {
          id: 20,
          nombre: "CONTADOR, EMPRESA",
          codigo: "251008",
        },
        {
          id: 21,
          nombre: "ESTIBADOR, MANUAL",
          codigo: "987010",
        },
        {
          id: 22,
          nombre: "INGENIERO CIVIL",
          codigo: "219001",
        },
        {
          id: 23,
          nombre: "ARQUITECTO, EDIFICIOS",
          codigo: "218001",
        },
        {
          id: 24,
          nombre: "TECNICO CALCULISTA, INGENIERIA CIVIL/COSTO DE CONSTRUCCION",
          codigo: "312002",
        },
        {
          id: 25,
          nombre: "CONTADOR, EMPRESA",
          codigo: "251008",
        },
        {
          id: 26,
          nombre: "PUBLICISTA, RESPONSABLE DE CAMPAÐA PUBLICITARIA",
          codigo: "271026",
        },
        {
          id: 27,
          nombre: "PROGRAMADOR, INFORMATICA/ANALISIS DE SISTEMAS",
          codigo: "319008",
        },
        {
          id: 28,
          nombre: "AUXILIAR DE OFICINA",
          codigo: "462001",
        },
        {
          id: 29,
          nombre: "GUARDIA DE SEGURIDAD (PRIVADOS)",
          codigo: "564003",
        },
        {
          id: 30,
          nombre: "MENSAJERO",
          codigo: "951006",
        },
        {
          id: 31,
          nombre: "LIMPIADOR DE: FABRICAS, HOTELES, OFICINAS Y RESTAURANTES",
          codigo: "942008",
        }
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cargos_sunat', null, {});
  }
};
