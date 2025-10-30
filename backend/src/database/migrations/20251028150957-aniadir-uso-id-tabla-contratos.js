'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Estados para validar las condiciones de alquiler, PENDIENTE, CONDICIONES SOLICITADAS, VALIDAR CONDICIONES, CONDICIONES ACEPTADAS

    await queryInterface.addColumn('contratos', 'estado_condiciones', {
      type: Sequelize.ENUM(
        'Creado',
        'Condiciones Solicitadas',
        'Validando Condiciones',
        'Condiciones Cumplidas'
      ),
      allowNull: false,
      defaultValue: 'Creado',
      after: 'estado' // coloca la nueva columna después de la columna 'estado'
    }).catch((error) => {
      console.log("La columna estado_condiciones ya existe en la tabla contratos, no se puede agregar");
    });

    await queryInterface.addColumn('contratos', 'uso_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      after: 'usuario_id'
    }).catch((error) => {
      console.log("La columna uso_id ya existe en la tabla contratos, no se puede agregar");
    });
    
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('contratos', 'estado_condiciones').catch((error) => {
       console.log("La columna estado_condiciones no existe en la tabla contratos, no se puede eliminar");
     });
     await queryInterface.removeColumn('contratos', 'uso_id').catch((error) => {
       console.log("La columna uso_id no existe en la tabla contratos, no se puede eliminar");
     });
  }
};
