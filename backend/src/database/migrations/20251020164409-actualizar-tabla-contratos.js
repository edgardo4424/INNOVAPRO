'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Eliminar la columna de la tabla contratos notas_legales si es que existe
    // Mejoralo con una transaction si es posible
     await queryInterface.removeColumn('contratos', 'notas_legales').catch((error) => {
       console.log("La columna notas_legales no existe en la tabla contratos, no se puede eliminar");
     });


    // Agregar nuevas columnas a la tabla contratos

    
    await queryInterface.addColumn('contratos', 'ref_contrato', {
      // Codigo del contrato
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('contratos', 'fecha_inicio', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn('contratos', 'fecha_fin', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn('contratos', 'clausulas_adicionales', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    
    await queryInterface.addColumn('contratos', 'requiere_valo_adelantada', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('contratos', 'renovaciones', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('contratos', 'estado', {
      type: Sequelize.ENUM(
        'PROGRAMADO',
        'VIGENTE',
        'POR VENCER',
        'VENCIDO',
        'FIRMADO'
      ),
      allowNull: false,
      defaultValue: 'PROGRAMADO',
    });

    await queryInterface.addColumn('contratos', 'despiece_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'despieces',
        key: 'id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('contratos', 'contacto_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contactos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('contratos', 'cliente_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('contratos', 'obra_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'obras',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('contratos', 'filial_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas_proveedoras',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('contratos', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

        await queryInterface.addColumn("contratos", "condiciones_alquiler", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "clausulas_adicionales",
    });

    await queryInterface.addColumn("contratos", "firmas", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "renovaciones",
    });

    await queryInterface.addColumn("contratos", "envio", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "firmas",
    });


     await queryInterface.removeColumn('contratos', 'createdAt');
    await queryInterface.removeColumn('contratos', 'updatedAt');
    
    // Agregar los timestamps true
    await queryInterface.addColumn('contratos', 'createdAt',  {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
         });
         
    await queryInterface.addColumn('contratos', 'updatedAt',  {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
               "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ),
         });
  },

  async down (queryInterface, Sequelize) {
    
    // Revertir los cambios realizados en el método up
    await queryInterface.addColumn('contratos', 'notas_legales', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.removeColumn('contratos', 'ref_contrato');
    await queryInterface.removeColumn('contratos', 'fecha_inicio');
    await queryInterface.removeColumn('contratos', 'fecha_fin');
    await queryInterface.removeColumn('contratos', 'clausulas_adicionales');
    await queryInterface.removeColumn('contratos', 'requiere_valo_adelantada');
    await queryInterface.removeColumn('contratos', 'renovaciones');
    await queryInterface.removeColumn('contratos', 'estado');
   

  }
};
