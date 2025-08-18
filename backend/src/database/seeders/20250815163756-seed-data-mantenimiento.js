"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "data_mantenimiento",
      [
        {
          id: 1,
          codigo: "valor_uit",
          nombre: "Valor de la UIT",
          descripcion:
            "Unidad Impositiva Tributaria usada como base para diversos cálculos laborales y tributarios.",
          valor: 5350.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          codigo: "valor_seguro",
          nombre: "Porcentaje de Seguro",
          descripcion: "Porcentaje aplicado para calcular el seguro de salud.",
          valor: 1.37,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          codigo: "valor_afp",
          nombre: "Porcentaje AFP",
          descripcion: "Tasa aplicada para el descuento de AFP del trabajador.",
          valor: 10.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          codigo: "valor_onp",
          nombre: "Porcentaje ONP",
          descripcion:
            "Porcentaje para trabajadores afiliados al sistema de pensiones ONP.",
          valor: 13.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          codigo: "valor_asignacion_familiar",
          nombre: "Asignación Familiar",
          descripcion:
            "Monto otorgado mensualmente por cada hijo registrado legalmente.",
          valor: 102.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          codigo: "valor_hora_extra",
          nombre: "Monto por Hora Extra",
          descripcion: "Remuneración adicional por cada hora extra trabajada.",
          valor: 10.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          codigo: "valor_desc_quinta_categoria",
          nombre: "Descuento Quinta Categoría",
          descripcion: "Porcentaje de impuesto a la renta de quinta categoría.",
          valor: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          codigo: "valor_no_computable",
          nombre: "Monto No Computable",
          descripcion:
            "Monto descontado por conceptos no computables en la gratificación.",
          valor: 10.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          codigo: "valor_falta",
          nombre: "Monto por Falta",
          descripcion:
            "Descuento aplicado por cada inasistencia injustificada.",
          valor: 10.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          codigo: "valor_bonificacion_essalud",
          nombre: "Valor Bonificación ESSALUD",
          descripcion:
            "Porcentaje de bonificación extraordinaria aplicable para trabajadores afiliados a ESSALUD (9%)",
          valor: 9.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
         {
          id: 11,
          codigo: "valor_desc_quinta_categoria_no_domiciliado",
          nombre: "Valor Renta 5ta / No domiciliado",
          descripcion:
            "Porcentaje de descuento para trabajadores no domiciliados en Perú.",
          valor: 30.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("data_mantenimiento", null, {});
  },
};
