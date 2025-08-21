'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gratificaciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      trabajador_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trabajadores',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      tipo_contrato: {
        type: Sequelize.ENUM('PLANILLA', 'HONORARIO'),
        allowNull: false,
        defaultValue: 'PLANILLA'
      },
      periodo: {
        type: Sequelize.STRING(7),
        allowNull: false
      },
      fecha_calculo: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      regimen: {
        type: Sequelize.ENUM('GENERAL', 'MYPE', 'MICRO'),
        allowNull: false
      },
      factor_regimen: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
        comment: '1.00 general, 0.50 mype, 0.00 micro'
      },
      sueldo_base: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      asignacion_familiar: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      promedio_horas_extras: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      promedio_bono_obra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      remuneracion_computable: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'suma de los 4 componentes'
      },
      meses_computables: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gratificacion_bruta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      faltas_dias: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      faltas_monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      no_computable: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'solo informativo, no entra a RC'
      },
      gratificacion_neta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'grati bruta - faltas'
      },
     /*  sistema_salud: {
        type: Sequelize.ENUM('ESSALUD', 'EPS'),
        allowNull: false,
        defaultValue: 'ESSALUD'
      }, */
      bonificacion_extraordinaria: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      renta_5ta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      adelantos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_pagar: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      locked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      usuario_cierre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      filial_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas_proveedoras',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
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
    },
   {
    timestamps: true,
    tableName: "gratificaciones",
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
  });
  
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gratificaciones');
  }
};
