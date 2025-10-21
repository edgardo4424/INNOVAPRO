'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("clientes", "cargo_representante", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Añadir domicilio_representante a la tabla clientes
    await queryInterface.addColumn("clientes", "domicilio_representante", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Añadir direccion_almacen a la tabla empresas_proveedoras
    await queryInterface.addColumn("empresas_proveedoras", "direccion_almacen", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("clientes", "cargo_representante");
    await queryInterface.removeColumn("clientes", "domicilio_representante");
    await queryInterface.removeColumn("empresas_proveedoras", "direccion_almacen");
  }
};
