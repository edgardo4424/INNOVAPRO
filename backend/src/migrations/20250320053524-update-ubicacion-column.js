module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("obras", "ubicacion", {
      type: Sequelize.STRING(255), // 🔥 Ahora acepta cualquier ubicación
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("obras", "ubicacion", {
      type: Sequelize.ENUM(
        "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", 
        "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", 
        "La Libertad", "Lambayeque", "Lima Metropolitana", "Loreto", 
        "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", 
        "Tacna", "Tumbes", "Ucayali"
      ),
      defaultValue: "Lima Metropolitana",
      allowNull: false,
    });
  },
};