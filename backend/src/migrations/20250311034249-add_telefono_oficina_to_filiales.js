module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('empresas_proveedoras', 'telefono_oficina', {
      type: Sequelize.STRING,
      allowNull: true, // No obligatorio
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('empresas_proveedoras', 'telefono_oficina');
  }
};