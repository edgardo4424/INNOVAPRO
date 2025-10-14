'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      const queries = [
      `UPDATE piezas SET peso_kg = '3.81' WHERE (id = '147')`,
      `UPDATE piezas SET peso_kg = '12.07' WHERE (id = '148')`
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
