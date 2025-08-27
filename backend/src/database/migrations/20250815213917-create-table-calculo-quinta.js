'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quinta_calculos', {
      id: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
      },
      trabajador_id: { 
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true 
      },
      contrato_id:   { 
        type: Sequelize.INTEGER.UNSIGNED, 
        allowNull: true 
      }, 
      dni: { 
        type: Sequelize.STRING(15), 
        allowNull: false 
      },
      anio: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
      },
      mes: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
      },
      remuneracion_mensual: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false 
      },
      ingresos_previos_acum: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      grati_julio_proj: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      grati_diciembre_proj: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      otros_ingresos_proj: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      bruto_anual_proyectado: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false 
      },
      renta_neta_anual: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false 
      },
      impuesto_anual: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false 
      },
      retenciones_previas: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      divisor_calculo: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
      },
      retencion_base_mes: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false 
      },
      extra_gravado_mes: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      retencion_adicional_mes: { 
        type: Sequelize.DECIMAL(14,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      uit_valor: { 
        type: Sequelize.DECIMAL(10,2), 
        allowNull: false 
      },
      deduccion_fija_uit: { 
        type: Sequelize.DECIMAL(6,2),  
        allowNull: false 
      }, 
      tramos_usados_json: { 
        type: Sequelize.JSON, 
        allowNull: false 
      },
      deduccion_adicional_anual: { 
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      fuente: { 
        type: Sequelize.ENUM('informativo', 'oficial'), 
        allowNull: false, 
        defaultValue: 'informativo' 
      },
      es_recalculo: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
      },
      agregado_todas_filiales: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
      },
      creado_por: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        allowNull: true 
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addIndex('quinta_calculos', ['dni', 'anio', 'mes']);
    await queryInterface.addIndex('quinta_calculos', ['trabajador_id']);
    await queryInterface.addIndex('quinta_calculos', ['contrato_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('quinta_calculos');
  }
};