module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("notificaciones", {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          usuarioId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: { model: "usuarios", key: "id" },
              onDelete: "CASCADE",
          },
          mensaje: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          tipo: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          leida: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("notificaciones");
  },
};