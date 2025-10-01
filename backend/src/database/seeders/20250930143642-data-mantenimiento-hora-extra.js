'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "data_mantenimiento",
      [
        {
          id: 29,
          codigo: "valor_hora_extra_mayor",
          nombre: "Valor de Hora extra mayor",
          descripcion:
            "Valor de la hora extra mayor al umbral establecido >=2200",
          valor: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 30,
          codigo: "valor_hora_extra_menor",
          nombre: "Valor de Hora extra menor",
          descripcion:
            "Valor de la hora extra menor al umbral establecido <2200",
          valor: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "data_mantenimiento",
      {
        codigo: {
          [Sequelize.Op.in]: [
            "valor_hora_extra_mayor",
            "valor_hora_extra_menor"
          ]
        }
      },
      {}
    );
  }
};
