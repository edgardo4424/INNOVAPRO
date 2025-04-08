module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tareas", "motivoDevolucion", {
        type: Sequelize.TEXT,
        allowNull: true,
        after: "estado", // 🔥 Ubica la columna después de "estado"
      }),
      queryInterface.addColumn("tareas", "correccionComercial", {
        type: Sequelize.TEXT,
        allowNull: true,
        after: "motivoDevolucion",
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("tareas", "motivoDevolucion"),
      queryInterface.removeColumn("tareas", "correccionComercial"),
    ]);
  },
};