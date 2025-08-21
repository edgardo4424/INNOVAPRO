'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    // 1. Crear tabla cierres_gratificaciones
    await queryInterface.createTable('cierres_gratificaciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      filial_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas_proveedoras',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      periodo: {
        type: Sequelize.STRING(7),
        allowNull: false,
        comment: 'Formato: YYYY-MM',
      },
      locked_at: {
        type: Sequelize.DATE,
        comment: 'Fecha de cierre oficial del periodo',
      },
      usuario_cierre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
       createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
  }
    }, {
    timestamps: true,
    tableName: "cierres_gratificaciones",
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
  });

    // 2. Agregar columna cierre_id a gratificaciones
    await queryInterface.addColumn('gratificaciones', 'cierre_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'filial_id', // ubicarlo después de filial_id
      references: {
        model: 'cierres_gratificaciones',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    
    // ✅ Añadir índice único después
await queryInterface.addConstraint('gratificaciones', {
  fields: ['trabajador_id', 'periodo', 'regimen', 'filial_id', 'cierre_id'],
  type: 'unique',
  name: 'uniq_trabajador_periodo'
});

 // Agregar unique constraint
await queryInterface.addConstraint('cierres_gratificaciones', {
  fields: ['filial_id', 'periodo'],
  type: 'unique',
  name: 'uniq_filial_periodo',
});
  },

  async down(queryInterface) {
    // 1. Eliminar columna de relación en gratificaciones
    await queryInterface.removeColumn('gratificaciones', 'cierre_id');

    // 2. Eliminar tabla de cierres
    await queryInterface.dropTable('cierres_gratificaciones');
  },
};
