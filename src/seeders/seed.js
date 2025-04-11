require("dotenv").config();
const { sequelize, Rol, Modulo, Usuario, Cliente } = require("../models");
const { encriptarPassword } = require("../utils/password");

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    const query = sequelize.getQueryInterface();

    // 🧹 Eliminar todo (en orden para evitar conflictos de FK)
    await query.bulkDelete("rol_modulos", null, {});
    await query.bulkDelete("usuarios", null, {});
    await query.bulkDelete("clientes", null, {});
    await query.bulkDelete("roles", null, {});
    await query.bulkDelete("modulos", null, {});

    // 🔄 Reiniciar ID autoincremental (solo MySQL)
    await query.sequelize.query("ALTER TABLE roles AUTO_INCREMENT = 1");
    await query.sequelize.query("ALTER TABLE modulos AUTO_INCREMENT = 1");
    await query.sequelize.query("ALTER TABLE usuarios AUTO_INCREMENT = 1");
    await query.sequelize.query("ALTER TABLE clientes AUTO_INCREMENT = 1");

    // 📥 Insertar roles
    const roles = await Rol.bulkCreate([
      { nombre: "Gerente General" },
      { nombre: "Administrador" },
      { nombre: "Ventas" },
      { nombre: "Oficina Técnica" },
    ]);
    console.log("✅ Roles insertados");

    // 📥 Insertar módulos
    const modulos = await Modulo.bulkCreate([
      { nombre: "Usuarios" },
      { nombre: "Clientes" },
      { nombre: "Cotizaciones" },
    ]);
    console.log("✅ Módulos insertados");

    // 🔗 Relacionar roles y módulos
    await roles[0].addModulos(modulos); // Gerente General a todos
    await roles[1].addModulos(modulos); // Admin a todos
    await roles[2].addModulos([modulos[1], modulos[2]]); // Ventas a algunos

    // 📥 Insertar usuario admin
    await Usuario.create({
      email: "luis@innova.pe",
      password: await encriptarPassword("123456"), // 💡 Reemplazar con hash real
      rolId: roles[0].id,
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
