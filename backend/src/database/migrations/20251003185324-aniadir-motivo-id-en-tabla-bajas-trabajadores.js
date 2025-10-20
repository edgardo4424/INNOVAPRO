'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    // Eliminar columna motivo (si existe)
    await queryInterface.removeColumn('bajas_trabajadores', 'motivo');

    // Añadir columna motivo_liquidacion_id
    await queryInterface.addColumn('bajas_trabajadores', 'motivo_liquidacion_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'motivos_liquidacion', // Nombre de la tabla referenciada
        key: 'id',                    // Columna referenciada
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      after: 'fecha_baja', // Coloca la nueva columna después de 'fecha_baja'
    });
  },

  async down (queryInterface, Sequelize) {
  
    // Aniadir columna motivo
    await queryInterface.addColumn('bajas_trabajadores', 'motivo', {
      type: Sequelize.ENUM('RENUNCIA', 'DESPIDO', 'FIN CONTRATO', 'MUTUO ACUERDO'),
      allowNull: false,
      defaultValue: 'FIN CONTRATO',
      after: 'fecha_baja', // Coloca la nueva columna después de 'fecha_baja'
    });

    // Eliminar columna motivo_liquidacion_id
    await queryInterface.removeColumn('bajas_trabajadores', 'motivo_liquidacion_id');
  }
};
