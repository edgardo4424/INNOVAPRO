'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('empresas_proveedoras', 'cuenta_banco', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('empresas_proveedoras', 'correo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('empresas_proveedoras', 'link_website', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // ...
    await queryInterface.addColumn('empresas_proveedoras', 'codigo_ubigeo', {
      type: Sequelize.STRING(6),
      allowNull: true,
    });
    // ...
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('empresas_proveedoras', 'cuenta_banco');
    await queryInterface.removeColumn('empresas_proveedoras', 'correo');
    await queryInterface.removeColumn('empresas_proveedoras', 'link_website');
    await queryInterface.removeColumn('empresas_proveedoras', 'codigo_ubigeo');

  }
};
