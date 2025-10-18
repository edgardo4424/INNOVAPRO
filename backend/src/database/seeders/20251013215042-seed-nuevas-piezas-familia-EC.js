'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const queries = [
      `UPDATE piezas SET peso_kg = '98.46' WHERE (id = '131')`,
      `UPDATE piezas SET peso_kg = '22.87' WHERE (id = '132')`,
      `UPDATE piezas SET peso_kg = '22.87' WHERE (id = '133')`,
      `UPDATE piezas SET peso_kg = '31.76' WHERE (id = '134')`,
      `UPDATE piezas SET peso_kg = '33.52' WHERE (id = '135')`,
      `UPDATE piezas SET peso_kg = '304.92' WHERE (id = '136')`,
      `UPDATE piezas SET peso_kg = '431.97' WHERE (id = '137')`,
      `UPDATE piezas SET peso_kg = '41.29' WHERE (id = '138')`,
      `UPDATE piezas SET peso_kg = '48.73' WHERE (id = '139')`,
      `UPDATE piezas SET peso_kg = '48.73' WHERE (id = '140')`,
      `UPDATE piezas SET peso_kg = '47.38' WHERE (id = '141')`,
      `UPDATE piezas SET peso_kg = '55.74' WHERE (id = '557')`,
      `UPDATE piezas SET peso_kg = '11.43' WHERE (id = '143')`,
      `UPDATE piezas SET peso_kg = '0.95' WHERE (id = '144')`,
      `UPDATE piezas SET peso_kg = '9.53' WHERE (id = '145')`,
      `UPDATE piezas SET descripcion = 'TRASPALETA HIDRÁULICA  - 1.0 TON', peso_kg = '431.97' WHERE (id = '146')`,
      `UPDATE piezas SET item = 'EC.0810' WHERE (id = '151')`,

      `UPDATE piezas SET precio_venta_dolares = '223.20', precio_venta_soles = '825.83' WHERE (id = '138')`,
  `UPDATE piezas SET precio_venta_dolares = '263.42', precio_venta_soles = '974.64' WHERE (id = '139')`,
  `UPDATE piezas SET precio_venta_dolares = '263.42', precio_venta_soles = '974.64' WHERE (id = '140')`,
  `UPDATE piezas SET precio_venta_dolares = '256.12', precio_venta_soles = '947.64' WHERE (id = '141')`,
  `UPDATE piezas SET precio_venta_dolares = '301.32', precio_venta_soles = '1114.87' WHERE (id = '557')`,
  `UPDATE piezas SET precio_venta_dolares = '61.81', precio_venta_soles = '228.69' WHERE (id = '143')`,
  `UPDATE piezas SET precio_venta_dolares = '5.15', precio_venta_soles = '19.06' WHERE (id = '144')`,

  `UPDATE piezas SET peso_kg = '0.51' WHERE (id = '151')`,
  `UPDATE piezas SET precio_venta_dolares = '2334.97', precio_venta_soles = '8639.40' WHERE (id = '146')`
    ];

    for (const sql of queries) {
      await queryInterface.sequelize.query(sql);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
