const { Rol } = require('../../models');

exports.findById = async (id) => {
    const rol = await Rol.findByPk(id);
    return rol ? rol.get({ plain: true }) : null;
  };
