'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const queries = [
      `UPDATE piezas SET item = 'CO.0010' WHERE (id = '149')`,
      `UPDATE piezas SET item = 'CO.0015' WHERE (id = '150')`,
      `UPDATE piezas SET item = 'CO.0030' WHERE (id = '153')`,
      `UPDATE piezas SET item = 'CO.0035' WHERE (id = '154')`,
      `UPDATE piezas SET item = 'CO.0040' WHERE (id = '155')`,
      `INSERT INTO piezas (item, familia_id, descripcion, peso_kg, precio_venta_dolares, precio_venta_soles, precio_alquiler_soles, stock_actual) VALUES ('CO.0050', '5', 'BARRA ASTM DE 1 1/4 x 400mm', '0', '0', '0', '0', '100')`,
      `INSERT INTO piezas (item, familia_id, descripcion, peso_kg, precio_venta_dolares, precio_venta_soles, precio_alquiler_soles, stock_actual) VALUES ('CO.0055', '5', 'BASE PERDIDA (Inc. 4 barra ASTM)', '0', '0', '0', '0', '100')`
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
