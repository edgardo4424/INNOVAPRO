'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn("guias_de_remision", "tipo_doc", "tipo_Doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "fecha_emision", "fecha_Emision", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "empresa_ruc", "empresa_Ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_tipo_doc", "cliente_Tipo_Doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_num_doc", "cliente_Num_Doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_razon_social", "cliente_Razon_Social", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_direccion", "cliente_Direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_cod_traslado", "guia_Envio_Cod_Traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_mod_traslado", "guia_Envio_Mod_Traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_peso_total", "guia_Envio_Peso_Total", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_und_peso_total", "guia_Envio_Und_Peso_Total", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_fec_traslado", "guia_Envio_Fec_Traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_partida_ubigeo", "guia_Envio_Partida_Ubigeo", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_partida_direccion", "guia_Envio_Partida_Direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_llegada_ubigeo", "guia_Envio_Llegada_Ubigeo", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_llegada_direccion", "guia_Envio_Llegada_Direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "estado_documento", "estado_Documento", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "id_base_dato", "id_Base_Dato", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_des_traslado", "guia_Envio_Des_Traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_vehiculo_placa", "guia_Envio_Vehiculo_Placa", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_partida_ruc", "guia_Envio_Partida_Ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_partida_cod_local", "guia_Envio_Partida_Cod_Local", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_llegada_ruc", "guia_Envio_Llegada_Ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_envio_llegada_cod_local", "guia_Envio_Llegada_Cod_Local", { transaction: t });
      await queryInterface.renameColumn("guia_detalles", "cod_producto", "cod_Producto", { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn("guias_de_remision", "tipo_Doc", "tipo_doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "fecha_Emision", "fecha_emision", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "empresa_Ruc", "empresa_ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_Tipo_Doc", "cliente_tipo_doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_Num_Doc", "cliente_num_doc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_Razon_Social", "cliente_razon_social", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "cliente_Direccion", "cliente_direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Cod_Traslado", "guia_envio_cod_traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Mod_Traslado", "guia_envio_mod_traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Peso_Total", "guia_envio_peso_total", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Und_Peso_Total", "guia_envio_und_peso_total", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Fec_Traslado", "guia_envio_fec_traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Partida_Ubigeo", "guia_envio_partida_ubigeo", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Partida_Direccion", "guia_envio_partida_direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Llegada_Ubigeo", "guia_envio_llegada_ubigeo", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Llegada_Direccion", "guia_envio_llegada_direccion", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "estado_Documento", "estado_documento", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "id_Base_Dato", "id_base_dato", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Des_Traslado", "guia_envio_des_traslado", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Vehiculo_Placa", "guia_envio_vehiculo_placa", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Partida_Ruc", "guia_envio_partida_ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Partida_Cod_Local", "guia_envio_partida_cod_local", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Llegada_Ruc", "guia_envio_llegada_ruc", { transaction: t });
      await queryInterface.renameColumn("guias_de_remision", "guia_Envio_Llegada_Cod_Local", "guia_envio_llegada_cod_local", { transaction: t });
      await queryInterface.renameColumn("guia_detalles", "cod_Producto", "cod_producto", { transaction: t });
    });
  }
};
