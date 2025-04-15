const { Contacto } = require("../../models");

exports.create = async (data) => {
  const contacto = await Contacto.create(data);

  // Relacionar clientes si existen
  /* if (clientesIds && clientesIds.length > 0) {
    const clientesRelacionados = await Cliente.findAll({ where: { id: data.clientesIds }, transaction });

    if (clientesRelacionados.length > 0) {
        const clienteContactos = clientesRelacionados.map(cliente => ({
            contacto_id: nuevoContacto.id,
            cliente_id: cliente.id
        }));
        await db.contacto_clientes.bulkCreate(clienteContactos, { transaction });
    }
} */

  // Relacionar obras si existen
  /* if (obrasIds && obrasIds.length > 0) {
    const obrasRelacionadas = await Obra.findAll({ where: { id: data.obrasIds }, transaction });

    if (obrasRelacionadas.length > 0) {
        const contactoObras = obrasRelacionadas.map(obra => ({
            contacto_id: nuevoContacto.id,
            obra_id: obra.id
        }));
        await db.contacto_obras.bulkCreate(contactoObras, { transaction });
    }
} */

  return contacto.get({ plain: true });
};

exports.findAll = async () => {
  const contactos = await Contacto.findAll();
  return contactos.map((u) => u.get({ plain: true }));
};

exports.findById = async (id) => {
  const contacto = await Contacto.findByPk(id);
  return contacto ? contacto.get({ plain: true }) : null;
};

exports.update = async ({ id, data }) => {
  const contacto = await Contacto.findByPk(id);
  contacto.set(data);
  await contacto.save(); // 💾 Guarda los cambios en la BD
  const contactoActualizado = await contacto.reload(); // 🔹 Recargar los datos completos desde la base de datos

  // Actualiza relaciones
  if (Array.isArray(clientesIds)) {
    await contactoActualizado.setClientes_asociados(clientesIds);
  }

  if (Array.isArray(obrasIds)) {
    await contactoActualizado.setObras_asociadas(obrasIds);
  }

  return contactoActualizado.get({ plain: true });
};

exports.delete = async (id) => {
  const contacto = await Contacto.findByPk(id);

  if (contacto) {
    await contacto.destroy();
    return true;
  } else {
    return false;
  }
};
