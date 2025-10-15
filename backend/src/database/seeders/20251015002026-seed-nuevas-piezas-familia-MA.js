'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        const queries = [
      `UPDATE piezas SET item = 'MA.0010', peso_kg = '6.35' WHERE (id = '546')`,
      `UPDATE piezas SET item = 'MA.0015', peso_kg = '0.64' WHERE (id = '547')`,
      `UPDATE piezas SET item = 'MA.0020', peso_kg = '2.54' WHERE (id = '548')`,
      `UPDATE piezas SET item = 'MA.0025', peso_kg = '54.00' WHERE (id = '549')`,
      `UPDATE piezas SET item = 'MA.0030', peso_kg = '85.76' WHERE (id = '550')`
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
