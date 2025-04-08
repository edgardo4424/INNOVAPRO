module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("obras", "estado", {
      type: Sequelize.ENUM(
        "Planificación",
        "Demolición",
        "Excavación",
        "Cimentación y estructura",
        "Cerramientos y albañilería",
        "Acabados",
        "Entrega y postventa"
      ),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("obras", "estado", {
      type: Sequelize.ENUM(
        "En Construcción",
        "Activo",
        "Finalizado",
        "Inactivo"
      ),
      allowNull: false,
    });
  },
};