require("dotenv").config();
const {
  sequelize,
  Rol,
  Modulo,
  Usuario,
  Cliente,
  Permiso,
  RolPermiso
} = require("../models");
const { encriptarPassword } = require("../utils/password");

const runSeeder = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Conectado a la base de datos");

    const query = sequelize.getQueryInterface();

    // 💥 Eliminar registros (en orden seguro por relaciones)
    const tablas = [
      "rol_permisos",
      "permisos",
      "cotizaciones",
      "clientes",
      "usuarios",
      "modulos",
      "roles"
    ];

    for (const tabla of tablas) {
      await query.bulkDelete(tabla, null, {});
    }

    // 🔄 Reiniciar AUTO_INCREMENT para cada tabla
    for (const tabla of tablas) {
      await query.sequelize.query(`ALTER TABLE ${tabla} AUTO_INCREMENT = 1`);
    }

    console.log("🧼 Base de datos reseteada correctamente");
    // Insertar modulos

    // 📥 Insertar roles
    const roles = await Rol.bulkCreate([
      { nombre: "Gerente General" },
      { nombre: "Clientes" },
      { nombre: "Gerencia" },
      { nombre: "Ventas" },
      { nombre: "Oficina Técnica" },
      { nombre: "Almacén" },
      { nombre: "Administración" },
    ]);
    console.log("✅ Roles insertados");

    // 📥 Insertar módulos
    const modulos = await Modulo.bulkCreate([
      { nombre: "Gestión de Usuarios" },
      { nombre: "Gestión de Filiales de Innova" },
      { nombre: "Gestión de Clientes" },
      { nombre: "Gestión de Contactos" },
      { nombre: "Gestión de Productos y Servicios" },
      { nombre: "Gestión de Obras" },
      { nombre: "Cotizaciones" },
      { nombre: "Centro de Anteción" },
      { nombre: "Registrar Tarea" },
    ]);

    console.log("✅ Módulos insertados");

    // 📥 Insertar permisos
    const permisos = await Permiso.bulkCreate([
      // Permisos de Gestión de usuarios
      { nombre: "Agregar Usuario", codigo: "USUARIO_AGREGAR", modulo_id: 1 },
      { nombre: "Listar Usuario", codigo: "USUARIO_LISTAR", modulo_id: 1 },
      { nombre: "Editar Usuario", codigo: "USUARIO_EDITAR", modulo_id: 1 },
      { nombre: "Eliminar Usuario", codigo: "USUARIO_ELIMINAR", modulo_id: 1 },

      // Permisos de Gestion de Filiales de Innova
      { nombre: "Agregar Filial", codigo: "FILIAL_AGREGAR", modulo_id: 2 },
      { nombre: "Listar Filial", codigo: "FILIAL_LISTAR", modulo_id: 2 },
      { nombre: "Editar Filial", codigo: "FILIAL_EDITAR", modulo_id: 2 },
      { nombre: "Eliminar Filial", codigo: "FILIAL_ELIMINAR", modulo_id: 2},
      // Permisos de Gestion de Clientes
      { nombre: "Agregar Cliente", codigo: "CLIENTE_AGREGAR", modulo_id: 3 },
      { nombre: "Listar Cliente", codigo: "CLIENTE_LISTAR", modulo_id: 3 },
      { nombre: "Editar Cliente", codigo: "CLIENTE_EDITAR", modulo_id: 3  },
      { nombre: "Eliminar Cliente", codigo: "CLIENTE_ELIMINAR", modulo_id: 3  },

      // Permisos de Gestion Contactos
      { nombre: "Agregar Contacto", codigo: "CONTACTO_AGREGAR", modulo_id: 4  },
      { nombre: "Listar Contacto", codigo: "CONTACTO_LISTAR", modulo_id: 4  },
      { nombre: "Editar Contacto", codigo: "CONTACTO_EDITAR", modulo_id: 4 },
      { nombre: "Eliminar Contacto", codigo: "CONTACTO_ELIMINAR", modulo_id: 4  },

      // Permisos de Gestion Productos y Servicios
      { nombre: "Agregar Producto y/o Servicio", codigo: "PRODUCTO_SERVICIO_AGREGAR", modulo_id: 5 },
      { nombre: "Listar Producto y/o Servicio", codigo: "PRODUCTO_SERVICIO_LISTAR", modulo_id: 5 },
      { nombre: "Editar Producto y/o Servicio", codigo: "PRODUCTO_SERVICIO_EDITAR", modulo_id: 5 },
      { nombre: "Eliminar Producto y/o Servicio", codigo: "PRODUCTO_SERVICIO_ELIMINAR", modulo_id: 5 },

      // Permisos de Gestion de obras
      { nombre: "Agregar Obra", codigo: "OBRA_AGREGAR", modulo_id: 6 },
      { nombre: "Listar Obra", codigo: "OBRA_LISTAR", modulo_id: 6 },
      { nombre: "Editar Obra", codigo: "OBRA_EDITAR", modulo_id: 6 },
      { nombre: "Eliminar Obra", codigo: "OBRA_ELIMINAR", modulo_id: 6 },

      // Permisos de cotizaciones
      { nombre: "Agregar Cotizacion", codigo: "COTIZACION_AGREGAR", modulo_id: 7 },
      { nombre: "Listar Cotizacion", codigo: "COTIZACION_LISTAR", modulo_id: 7 },
      { nombre: "Editar Cotizacion", codigo: "COTIZACION_EDITAR", modulo_id: 7 },
      { nombre: "Eliminar Cotizacion", codigo: "COTIZACION_ELIMINAR", modulo_id: 7 },

      // Permisos de Centro de Atencion
    
      { nombre: "Listar tarea", codigo: "TAREA_LISTAR", modulo_id: 8 },
      { nombre: "Editar tarea", codigo: "TAREA_EDITAR", modulo_id: 8 },
      { nombre: "Eliminar tarea", codigo: "TAREA_ELIMINAR", modulo_id: 8 },
      { nombre: "Tomar tarea", codigo: "TAREA_TOMAR", modulo_id: 8 },

      // Permisos de Agregar Tarea
      { nombre: "Agregar tarea", codigo: "TAREA_AGREGAR", modulo_id: 9 },


    ]);

    console.log("✅ Permisos insertados");

    const rol_permisos_cliente = [
      {
        rol_id: 2, // Cliente
        permiso_id: 1
      },
      {
        rol_id: 2,
        permiso_id: 2
      },
      {
        rol_id: 2,
        permiso_id: 3
      },
      {
        rol_id: 2,
        permiso_id: 4
      },
      {
        rol_id: 2,
        permiso_id: 5
      },
      {
        rol_id: 2,
        permiso_id: 6
      },
      {
        rol_id: 2,
        permiso_id: 7
      },
      {
        rol_id: 2,
        permiso_id: 8
      }
    ]

    const rol_permisos_gerente_general = permisos.map((p, index) => ({
      rol_id: 1,
      permiso_id: index+1,
    }))

    // 🔗 Relacionar roles y permisos
    await RolPermiso.bulkCreate(rol_permisos_gerente_general)

    console.log('roles permisos de genente general insertado');
    await RolPermiso.bulkCreate(rol_permisos_cliente)
    console.log('roles permisos de Cliente insertado');

    // 📥 Insertar usuario admin
    await Usuario.create({
      email: "luis@innova.pe",
      password: await encriptarPassword("Luis123456"), // 💡 Reemplazar con hash real
      rol_id: 1,
      nombre: "Luis Gonzales"
    });

    // 📥 Insertar clientes
    await Cliente.bulkCreate([
      { nombre: "Cliente A", email: "clienteA@gmail.com" },
      { nombre: "Cliente B", email: "clienteB@gmail.com" },
    ]);

    console.log("🎉 Seeder ejecutado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar el seeder:", error);
    process.exit(1);
  }
};

runSeeder();
