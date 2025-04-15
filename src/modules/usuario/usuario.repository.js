const { Usuario, Rol, Modulo, Permiso } = require("../../models");

// 🆕 Crear usuario y devolver objeto plano
exports.create = async (data) => {
  const usuario = await Usuario.create(data);
  return usuario.get({ plain: true });
};

// 📦 Obtener todos los usuarios como objetos planos
exports.findAll = async () => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ["rol_id"] }, // 🚫 Excluir el campo rolId del resultado
    include: {
      model: Rol,
      attributes: ["id", "nombre"], // solo traemos el nombre del rol
    },
  });

  return usuarios.map((u) => u.get({ plain: true }));
};

// 🔍 Buscar usuario por id (objeto plano)
exports.findById = async (id) => {
  const usuario = await Usuario.findByPk(id);
  return usuario ? usuario.get({ plain: true }) : null;
};

// 🔍 Buscar usuario por email (objeto plano)
exports.findByEmail = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });
  return usuario ? usuario.get({ plain: true }) : null;
};

// 🆕 Actualizar un usuario y devolver todo el objeto
exports.update = async ({ id, data }) => {
  const usuario = await Usuario.findByPk(id);
  console.log('data a actualizar', data);
  usuario.set(data);
  await usuario.save(); // 💾 Guarda los cambios en la BD
  const usuarioActualizado = await usuario.reload(); // 🔹 Recargar los datos completos desde la base de datos
  return usuarioActualizado.get({ plain: true });
};

exports.delete = async (id) => {
  const usuario = await Usuario.findByPk(id);
  console.log('usuario', usuario);
  if (usuario) {
    await usuario.destroy();
    return true;
  }else{
    return false
  }
};


// 🔍 Buscar usuario por email con relaciones (Rol y Modulos)
exports.findByEmailWithRolAndModulosAndPermisos = async (email) => {
  const usuario = await Usuario.findOne({
    where: { email },
    attributes: { exclude: ["rol_id"] }, // 🚫 Excluir el campo rolId del resultado
    include: {
      model: Rol, // Incluir la relación con Rol
      include: {
        model: Permiso, // Incluir la relación con Permiso
        through: { attributes: [] }, // Excluir los atributos de la tabla intermedia 'RoleModule'
        include: {
          model: Modulo,
          /* attributes: ['id', 'nombre'] // solo lo necesario */
        }
      },
    }
  });

  if (!usuario) return null;

  const plano = usuario.get({ plain: true });

  const { Rol: rolUsuario, ...usuarioPlano } = plano;

  console.log({rolUsuario, usuarioPlano});

  // 🔄 Extraer permisos desde el Rol
  const permisos = rolUsuario?.Permisos || [];

  console.log(permisos);

  // 🔁 Agrupar los módulos únicos
  const modulosMap = new Map();
  for (const permiso of permisos) {
    const modulo = permiso.Modulo;
    if (modulo && !modulosMap.has(modulo.id)) {
      modulosMap.set(modulo.id, modulo);
    }
  }

  const modulos = Array.from(modulosMap.values());

  console.log('modulos', modulos);
  return {
    usuario: plano,
    permisos: permisos.map(({ Modulo, ...rest }) => rest), // Limpiar relación con módulo
    modulos,
  };
};


// 🔍 Obtener los modelos de un usuario por id
exports.findModulesByUserId = async (usuarioId) => {
  const usuario = await Usuario.findOne({
    where: {
      id: usuarioId
    },
    include: {
      model: Rol, // Incluir la relación con Rol
      include: {
        model: Permiso, // Incluir la relación con Permiso
        through: { attributes: [] }, // Excluir los atributos de la tabla intermedia 'RoleModule'
        /* include: {
          module: Modulo
        } */
      },
    },
  });

  console.log('usuario', usuario);
  return usuario ? usuario.get({ plain: true }) : null;
};

