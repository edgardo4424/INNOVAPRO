module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('trabajadores', 'telefono', {
      type: Sequelize.STRING(),
      allowNull: true,
      after: 'numero_documento'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('trabajadores', 'telefono');
  }
};