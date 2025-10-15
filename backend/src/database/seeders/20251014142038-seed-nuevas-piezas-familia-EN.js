'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const queries = [
      `DELETE FROM stock`,
      
    
      `DELETE FROM piezas WHERE (id = '308')`,
      `DELETE FROM piezas WHERE (id = '309')`,
      `DELETE FROM piezas WHERE (id = '310')`,
      `DELETE FROM piezas WHERE (id = '311')`,

      `UPDATE piezas SET item = 'EN.0015', peso_kg = '5.14' WHERE (id = '304')`,
      `UPDATE piezas SET item = 'EN.0020', peso_kg = '4.28' WHERE (id = '305')`,
      `UPDATE piezas SET item = 'EN.0025', peso_kg = '2.00' WHERE (id = '306')`,
      `UPDATE piezas SET item = 'EN.0010', peso_kg = '6.43' WHERE (id = '307')`,
      `UPDATE piezas SET item = 'EN.0030', peso_kg = '4.28' WHERE (id = '312')`,
      `UPDATE piezas SET item = 'EN.0035', peso_kg = '3.18' WHERE (id = '313')`,
      `UPDATE piezas SET item = 'EN.0040', peso_kg = '9.25' WHERE (id = '314')`,
      `UPDATE piezas SET item = 'EN.0045', peso_kg = '12.37', precio_venta_soles = '247.39' WHERE (id = '315')`,
      `UPDATE piezas SET item = 'EN.0050', peso_kg = '8.25' WHERE (id = '316')`,
      `UPDATE piezas SET item = 'EN.0055', peso_kg = '6.35' WHERE (id = '317')`,
      `UPDATE piezas SET item = 'EN.0060', peso_kg = '95.29' WHERE (id = '318')`,
      `UPDATE piezas SET item = 'EN.0065', peso_kg = '114.35' WHERE (id = '319')`,
      `UPDATE piezas SET item = 'EN.0070', peso_kg = '152.46' WHERE (id = '320')`,
      `UPDATE piezas SET item = 'EN.0075', peso_kg = '190.58' WHERE (id = '321')`,
      `UPDATE piezas SET item = 'EN.0080', peso_kg = '95.29' WHERE (id = '322')`,
      `UPDATE piezas SET item = 'EN.0085', peso_kg = '1.37' WHERE (id = '323')`,
      `UPDATE piezas SET item = 'EN.0090', peso_kg = '1.71', precio_venta_soles = '34.28' WHERE (id = '324')`,
      `UPDATE piezas SET item = 'EN.0095', peso_kg = '2.06' WHERE (id = '325')`,
      `UPDATE piezas SET item = 'EN.0100', peso_kg = '1.59', precio_venta_soles = '31.77' WHERE (id = '326')`,
      `UPDATE piezas SET item = 'EN.0105', peso_kg = '15.88' WHERE (id = '327')`,
      `UPDATE piezas SET item = 'EN.0110', peso_kg = '15.88' WHERE (id = '328')`,
      `UPDATE piezas SET item = 'EN.0115', peso_kg = '22.23' WHERE (id = '329')`,
      `UPDATE piezas SET item = 'EN.0120', peso_kg = '3.18' WHERE (id = '330')`,
      `UPDATE piezas SET item = 'EN.0125', peso_kg = '3.18' WHERE (id = '331')`,
      `UPDATE piezas SET item = 'EN.0130', peso_kg = '50.20' WHERE (id = '332')`,
      `UPDATE piezas SET item = 'EN.0135', peso_kg = '36.93' WHERE (id = '333')`,
      `UPDATE piezas SET item = 'EN.0140', peso_kg = '29.43' WHERE (id = '334')`,
      `UPDATE piezas SET item = 'EN.0145', peso_kg = '32.31' WHERE (id = '335')`,
      `UPDATE piezas SET item = 'EN.0150', peso_kg = '15.58' WHERE (id = '336')`,
      `UPDATE piezas SET item = 'EN.0155', peso_kg = '14.42' WHERE (id = '337')`,
      `UPDATE piezas SET item = 'EN.0160', peso_kg = '28.19', precio_venta_soles = '563.88' WHERE (id = '338')`,
      `UPDATE piezas SET item = 'EN.0165', peso_kg = '11.79', precio_venta_soles = '235.86' WHERE (id = '339')`,
      `UPDATE piezas SET item = 'EN.0170', peso_kg = '2.19', precio_venta_soles = '43.84' WHERE (id = '340')`,
      `UPDATE piezas SET item = 'EN.0175', peso_kg = '23.41' WHERE (id = '341')`,
      `UPDATE piezas SET item = 'EN.0180', peso_kg = '21.50' WHERE (id = '342')`,
      `UPDATE piezas SET item = 'EN.0185', peso_kg = '20.07' WHERE (id = '343')`,
      `UPDATE piezas SET item = 'EN.0190', peso_kg = '18.63' WHERE (id = '344')`,
      `UPDATE piezas SET item = 'EN.0195', peso_kg = '17.20' WHERE (id = '345')`,
      `UPDATE piezas SET item = 'EN.0200', peso_kg = '12.66' WHERE (id = '346')`,
      `UPDATE piezas SET item = 'EN.0205', peso_kg = '9.32' WHERE (id = '347')`,
      `UPDATE piezas SET item = 'EN.0210', peso_kg = '12.71' WHERE (id = '348')`,
      `UPDATE piezas SET item = 'EN.0215', peso_kg = '14.29' WHERE (id = '349')`,
      `UPDATE piezas SET item = 'EN.0220', peso_kg = '15.88' WHERE (id = '350')`,
      `UPDATE piezas SET item = 'EN.0225', peso_kg = '38.88', precio_venta_soles = '777.68' WHERE (id = '351')`,
      `UPDATE piezas SET item = 'EN.0230', peso_kg = '35.29', precio_venta_soles = '705.82' WHERE (id = '352')`,
      `UPDATE piezas SET item = 'EN.0235', peso_kg = '30.52' WHERE (id = '353')`,
      `UPDATE piezas SET item = 'EN.0240', peso_kg = '28.43', precio_venta_soles = '568.57' WHERE (id = '354')`,
      `UPDATE piezas SET item = 'EN.0245', peso_kg = '24.96', precio_venta_soles = '499.24' WHERE (id = '355')`,
      `UPDATE piezas SET item = 'EN.0250', peso_kg = '21.16' WHERE (id = '356')`,
      `UPDATE piezas SET item = 'EN.0255', peso_kg = '46.20' WHERE (id = '357')`,
      `UPDATE piezas SET item = 'EN.0260', peso_kg = '35.57' WHERE (id = '358')`,
      `UPDATE piezas SET item = 'EN.0265', peso_kg = '7.70', precio_venta_soles = '153.99' WHERE (id = '359')`,
      `UPDATE piezas SET item = 'EN.0270', peso_kg = '79.41' WHERE (id = '360')`,
      `UPDATE piezas SET item = 'EN.0275', peso_kg = '2.70' WHERE (id = '361')`,
      `UPDATE piezas SET item = 'EN.0280', peso_kg = '7.70', precio_venta_soles = '153.99' WHERE (id = '362')`,
      `UPDATE piezas SET item = 'EN.0285', peso_kg = '3.84' WHERE (id = '363')`,
      
    ];

    
    
    for (const sql of queries) {
      await queryInterface.sequelize.query(sql);
    }
  },

  async down (queryInterface, Sequelize) {
   
  }
};
