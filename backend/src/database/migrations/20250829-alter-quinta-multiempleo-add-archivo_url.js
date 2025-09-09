module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quinta_multiempleo_declaraciones', 'archivo_url', {
      type: Sequelize.STRING(512),
      allowNull: true,
      after: 'detalle_json'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('quinta_multiempleo_declaraciones', 'archivo_url');
  }
};