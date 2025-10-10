"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable("soporte_multi_interno_detalles", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

      // FK al cálculo de quinta
      quinta_calculo_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

      // Snapshots JSON según estructura solicitada
      remu_multi_json:  { type: DataTypes.JSON, allowNull: false }, 
      grati_multi_json: { type: DataTypes.JSON, allowNull: false }, 
      af_multi_json:    { type: DataTypes.JSON, allowNull: false }, 

      total_ingresos: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    }, {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    });

    await queryInterface.addIndex("soporte_multi_interno_detalles", ["quinta_calculo_id"], { name: "idx_smid_quinta_calculo_id" });

    // FK fuerte al cálculo (cascade para limpiar soportes si se elimina el cálculo)
    try {
      await queryInterface.addConstraint("soporte_multi_interno_detalles", {
        fields: ["quinta_calculo_id"],
        type: "foreign key",
        name: "fk_smid_quinta_calculo",
        references: { table: "quinta_calculos", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    } catch (_) {}
  },

  async down(queryInterface/*, Sequelize*/) {
    try { await queryInterface.removeConstraint("soporte_multi_interno_detalles", "fk_smid_quinta_calculo"); } catch (_) {}
    try { await queryInterface.removeIndex("soporte_multi_interno_detalles", "idx_smid_quinta_calculo_id"); } catch (_) {}
    await queryInterface.dropTable("soporte_multi_interno_detalles");
  },
};