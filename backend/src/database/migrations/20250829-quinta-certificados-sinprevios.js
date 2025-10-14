module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quinta_certificados_externos', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      dni: { type: Sequelize.STRING(15), allowNull: false },
      anio: { type: Sequelize.INTEGER, allowNull: false },
      renta_bruta_total: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      retenciones_previas: { type: Sequelize.DECIMAL(12,2), defaultValue: 0 },
      detalle_json: { type: Sequelize.JSON, allowNull: true },
      archivo_url: { type: Sequelize.STRING(512) },
      estado: { type: Sequelize.ENUM('vigente','anulado'), defaultValue: 'vigente' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('quinta_certificados_externos', ['dni','anio'], { unique: true, name: 'uq_quinta_cert_dni_anio' });

    await queryInterface.createTable('quinta_declaracion_sin_previos', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      dni: { type: Sequelize.STRING(15), allowNull: false },
      anio: { type: Sequelize.INTEGER, allowNull: false },
      fecha_declaracion: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      archivo_url: { type: Sequelize.STRING(512) },
      observaciones: { type: Sequelize.STRING(1000) },
      estado: { type: Sequelize.ENUM('vigente','anulado'), defaultValue: 'vigente' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('quinta_declaracion_sin_previos', ['dni','anio'], { unique: true, name: 'uq_quinta_sinprev_dni_anio' });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('quinta_certificados_externos', 'uq_quinta_cert_dni_anio');
    await queryInterface.removeIndex('quinta_declaracion_sin_previos', 'uq_quinta_sinprev_dni_anio');
    await queryInterface.dropTable('quinta_certificados_externos');
    await queryInterface.dropTable('quinta_declaracion_sin_previos');
  }
};