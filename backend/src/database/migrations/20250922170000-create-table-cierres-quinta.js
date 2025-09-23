'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cierres_quinta', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      filial_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'empresas_proveedoras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      periodo: {
        type: Sequelize.STRING(7), 
        allowNull: false
      },

      locked_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },

      usuario_cierre_id: {
        type: Sequelize.INTEGER,  
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addConstraint('cierres_quinta', {
      fields: ['filial_id', 'periodo'],
      type: 'unique',
      name: 'uq_cierres_quinta_filial_periodo'
    });

    await queryInterface.addIndex('cierres_quinta', ['periodo'], {
      name: 'idx_cierres_quinta_periodo'
    });

    await queryInterface.addIndex('cierres_quinta', ['usuario_cierre_id'], {
      name: 'idx_cierres_quinta_usuario'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cierres_quinta');
  }
};