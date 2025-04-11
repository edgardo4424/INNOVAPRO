const { Usuario, Rol, Modulo } = require('../models');

// 🆕 Crear usuario y devolver objeto plano
exports.create = async (data) => {
  const usuario = await Usuario.create(data);
  return usuario.get({ plain: true });
};

// 📦 Obtener todos los usuarios como objetos planos
exports.findAll = async () => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ['rolId'] }, // 🚫 Excluir el campo rolId del resultado
    include: {
      model: Rol,
      attributes: ['id','nombre'], // solo traemos el nombre del rol
    }
  });

  return usuarios.map(u => u.get({ plain: true }));
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

// 🔍 Buscar usuario por email con relaciones (Rol y Modulos)
exports.findByEmailWithRolAndModulos = async (email) => {
  const usuario = await Usuario.findOne({
    where: { email },
    attributes: { exclude: ['rolId'] }, // 🚫 Excluir el campo rolId del resultado
    include: [
      {
        model: Rol,
        attributes: ['id','nombre'],
        include: [{ model: Modulo, attributes: ['id','nombre'] }],
      }
    ]
  });
  return usuario ? usuario.get({ plain: true }) : null;
};
