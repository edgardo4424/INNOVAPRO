"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
     // ✅ Añadir índice único después
await queryInterface.addConstraint('gratificaciones', {
  fields: ['trabajador_id', 'periodo', 'regimen', 'filial_id', 'cierre_id', 'fecha_ingreso', 'fecha_fin'],
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
  // Eliminar constraints únicos

  // Eliminar constraint de la tabla gratificaciones
  await queryInterface.removeConstraint('gratificaciones', 'uniq_trabajador_periodo');

  // Eliminar constraint de la tabla cierres_gratificaciones
  await queryInterface.removeConstraint('cierres_gratificaciones', 'uniq_filial_periodo');
}

};
