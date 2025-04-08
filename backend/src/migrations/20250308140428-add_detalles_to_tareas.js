module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tareas", "detalles", {
      type: Sequelize.JSON, // Permite almacenar los detalles como un objeto JSON
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("tareas", "detalles");
  }
};
