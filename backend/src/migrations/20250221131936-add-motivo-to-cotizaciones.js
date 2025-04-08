'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cotizaciones", "motivo", {
      type: Sequelize.ENUM("ALQUILER", "VENTA"),
      allowNull: false,
      defaultValue: "ALQUILER",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("cotizaciones", "motivo");
  },
};
