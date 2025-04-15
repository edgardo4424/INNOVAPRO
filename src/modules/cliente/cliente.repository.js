const { Cliente } = require("../../models");

exports.create = async (data) => {
  const cliente = await Cliente.create(data);
  return cliente.get({ plain: true });
};

exports.findAll = async () => {
  const clientes = await Cliente.findAll();
  return clientes.map((u) => u.get({ plain: true }));
};

exports.findById = async (id) => {
  const cliente = await Cliente.findByPk(id);
  return cliente ? cliente.get({ plain: true }) : null;
};

exports.update = async ({ id, data }) => {
  const cliente = await Cliente.findByPk(id);
  console.log('data a actualizar', data);
  cliente.set(data);
  await cliente.save(); // 💾 Guarda los cambios en la BD
  const clienteActualizado = await cliente.reload(); // 🔹 Recargar los datos completos desde la base de datos
  return clienteActualizado.get({ plain: true });
};

exports.delete = async (id) => {
  const cliente = await Cliente.findByPk(id);
  console.log('cliente', cliente);
  if (cliente) {
    await cliente.destroy();
    return true;
  }else{
    return false
  }
};

exports.getClientsWithContacts = async() => {
    const clientes = await Cliente.findAll({
        include: [
            {
                model: Contacto,
                through: { attributes: [] }, // ✅ Relación correcta con la tabla intermedia
            }
        ]
    });
  return clientes.map((u) => u.get({ plain: true }));
}
