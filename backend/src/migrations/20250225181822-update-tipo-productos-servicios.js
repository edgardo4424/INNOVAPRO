module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("productos_servicios", "tipo", {
      type: Sequelize.ENUM("Equipo", "Servicio"),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("productos_servicios", "tipo", {
      type: Sequelize.ENUM('andamio_colgante', 'andamio_fachada', 'andamio_trabajo'), // Devolverlo a la versión anterior si es necesario
      allowNull: false
    });
  }
};