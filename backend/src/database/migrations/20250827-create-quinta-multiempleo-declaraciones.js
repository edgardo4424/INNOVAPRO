module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quinta_multiempleo_declaraciones', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      dni: { type: Sequelize.STRING(15), allowNull: false },
      anio: { type: Sequelize.INTEGER, allowNull: false },

      filial_principal_id: { type: Sequelize.INTEGER, allowNull: true },
      renta_bruta_otros_anual: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      retenciones_previas_otros: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      detalle_json: { type: Sequelize.JSON, allowNull: true },

      estado: { type: Sequelize.ENUM('VIGENTE','ANULADO'), defaultValue: 'VIGENTE' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('quinta_multiempleo_declaraciones', ['dni','anio'], { unique: true, name: 'uq_quinta_multi_dni_anio' });
    await queryInterface.addIndex('quinta_multiempleo_declaraciones', ['filial_principal_id'], { name: 'ix_quinta_multi_filial' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('quinta_multiempleo_declaraciones', 'uq_quinta_multi_dni_anio');
    await queryInterface.removeIndex('quinta_multiempleo_declaraciones', 'ix_quinta_multi_filial');
    await queryInterface.dropTable('quinta_multiempleo_declaraciones');
  }
};