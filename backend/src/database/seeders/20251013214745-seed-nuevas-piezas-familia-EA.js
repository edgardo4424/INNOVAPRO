'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const queries = [
      `UPDATE piezas SET peso_kg = '109.41', precio_venta_soles = '2188.15' WHERE (id = '107')`,
      `UPDATE piezas SET peso_kg = '14.25', precio_venta_soles = '285.08' WHERE (id = '108')`,
      `UPDATE piezas SET peso_kg = '14.25', precio_venta_soles = '285.08' WHERE (id = '109')`,
      `UPDATE piezas SET peso_kg = '109.41', precio_venta_soles = '2188.15' WHERE (id = '110')`,
      `UPDATE piezas SET peso_kg = '14.25', precio_venta_soles = '285.08' WHERE (id = '111')`,
      `UPDATE piezas SET peso_kg = '109.41', precio_venta_soles = '2188.15' WHERE (id = '112')`,
      `UPDATE piezas SET peso_kg = '109.41', precio_venta_soles = '2188.15' WHERE (id = '113')`,
      `UPDATE piezas SET peso_kg = '14.25', precio_venta_soles = '285.08' WHERE (id = '114')`,
      `UPDATE piezas SET peso_kg = '14.25', precio_venta_soles = '285.08' WHERE (id = '115')`,
      `UPDATE piezas SET peso_kg = '10.41' WHERE (id = '116')`,
      `UPDATE piezas SET peso_kg = '10.41' WHERE (id = '117')`,
      `UPDATE piezas SET peso_kg = '10.41' WHERE (id = '118')`,
      `UPDATE piezas SET peso_kg = '10.41' WHERE (id = '119')`,
      `UPDATE piezas SET descripcion = 'GURSAM 60 - ESCALERA DE ACCESO - 2M', peso_kg = '114.88' WHERE (id = '120')`,
      `UPDATE piezas SET descripcion = 'GURSAM 60 - BARANDILLA INTERMEDIA - 2M', peso_kg = '14.97' WHERE (id = '121')`,
      `UPDATE piezas SET peso_kg = '43.23' WHERE (id = '122')`,
      `UPDATE piezas SET peso_kg = '22.34' WHERE (id = '123')`,
      `UPDATE piezas SET peso_kg = '43.23' WHERE (id = '124')`,
      `UPDATE piezas SET peso_kg = '22.34' WHERE (id = '125')`,
      `UPDATE piezas SET descripcion = 'GURSAM 120 - PELDAÑOS', peso_kg = '12.09' WHERE (id = '126')`,
      `UPDATE piezas SET descripcion = 'GURSAM 60 - PELDAÑOS', peso_kg = '5.50' WHERE (id = '127')`,
      `UPDATE piezas SET peso_kg = '43.23' WHERE (id = '128')`,
      `UPDATE piezas SET peso_kg = '22.34' WHERE (id = '129')`,
      `UPDATE piezas SET peso_kg = '0.51' WHERE (id = '130')`,
      `INSERT INTO piezas (item, familia_id, descripcion, peso_kg, precio_venta_dolares, precio_venta_soles, precio_alquiler_soles, stock_actual) VALUES ('EA.1525', '2', 'GURSAM 60 - ESCALERA DE ACCESO 1M', '114.88', '620.96', '2297.56', '114.88', '100')`,
      `INSERT INTO piezas (item, familia_id, descripcion, peso_kg, precio_venta_dolares, precio_venta_soles, precio_alquiler_soles, stock_actual) VALUES ('EA.1550', '2', 'GURSAM 60 - BARANDILLA INTERMEDIA 1M', '14.97', '80.9', '299.33', '14.97', '100')`,
      `INSERT INTO piezas (item, familia_id, descripcion, peso_kg, precio_venta_dolares, precio_venta_soles, precio_alquiler_soles, stock_actual) VALUES ('EA.1575', '2', 'GURSAM 60 - BARANDA SUPERIOR 1M', '10.41', '56.27', '208.20', '10.41', '100')`
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
