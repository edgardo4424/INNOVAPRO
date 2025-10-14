module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clientes', 'tipo_documento', {
      type: Sequelize.ENUM("DNI", "CE"),
      allowNull: true,
      after: 'representante_legal'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('clientes', 'tipo_documento');
  }
};