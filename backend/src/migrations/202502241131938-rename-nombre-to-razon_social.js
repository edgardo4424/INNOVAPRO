module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn("empresas_proveedoras", "nombre", "razon_social");
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn("empresas_proveedoras", "razon_social", "nombre");
    }
};