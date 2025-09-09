module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("quinta_multiempleo_detalles", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      multiempleo_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "quinta_multiempleo_declaraciones", key: "id" },
        onDelete: "CASCADE"
      },
      tipo: { type: Sequelize.ENUM("FILIAL","EXTERNO"), allowNull: false },
      filial_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      empleador_ruc: { type: Sequelize.STRING(20), allowNull: true },
      empleador_razon_social: { type: Sequelize.STRING(255), allowNull: true },
      renta_bruta_anual: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      retenciones_previas: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      detalle_json: { type: Sequelize.JSON, allowNull: true },
      estado: { type: Sequelize.ENUM("VIGENTE","ANULADO"), defaultValue:"VIGENTE" },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("quinta_multiempleo_detalles");
  }
};
