module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quinta_multiempleo_declaraciones', 'aplica_desde_mes', {
      type: Sequelize.TINYINT, allowNull: true, after: 'anio'
    });
  },
  async down(queryInterface) { await queryInterface.removeColumn('quinta_multiempleo_declaraciones', 'aplica_desde_mes'); }
};
