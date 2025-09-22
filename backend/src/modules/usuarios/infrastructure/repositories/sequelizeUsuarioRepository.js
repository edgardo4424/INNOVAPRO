const { Usuario } = require("../models/usuarioModel");
const UsuarioRepository = require("../../domain/repositories/usuarioRepository"); // Importamos la interfaz del repositorio
const { Trabajador } = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const db = require("../../../../database/models");
const { Cargo } = require("../../../trabajadores/infraestructure/models/cargoModel");

class SequelizeUsuarioRepository extends UsuarioRepository {
  // La clase SequelizeUsuarioRepository extiende la interfaz UsuarioRepository
  getModel() {
    return require("../models/usuarioModel").Usuario; // Retorna el modelo de cliente
  }

  async crear(usuarioData) {
    return await Usuario.create(usuarioData);
  }

  async obtenerUsuarios() {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
          include: [
            {
              model: db.cargos,
              as: "cargo"
            }
          ]
        }
      ]
    });

    console.log('usuarios', usuarios);

    const listaUsuarios = usuarios.map( u => (({
      id: u.id,
      nombre: u.trabajador.nombres+" "+u.trabajador.apellidos,
      email: u.email,
      rol: u.trabajador?.cargo?.nombre
    })))

    return listaUsuarios;
  }

  async obtenerPorId(id) {
    return await Usuario.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
  }

  async obtenerPorEmail(email) {
  return await Usuario.findOne({
    where: { email },
    include: [
      {
        model: db.trabajadores,
        as: "trabajador",        // <— alias EXACTO de la asociación
      },
    ],
  });
}

  async actualizarUsuario(id, usuarioData) {
    const usuario = await Usuario.findByPk(id); // Busca el usuario por ID
    if (!usuario) {
      // Si no se encuentra el usuario, retorna null
      console.log("❌ Usuario no encontrado");
      return null;
    }

    await usuario.update(usuarioData); // Actualiza el usuario con los nuevos datos
    return usuario; // Retorna el usuario actualizado
  }

  async eliminarUsuario(id) {
    const usuario = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el usuario por ID
    if (!usuario) return null; // Si no se encuentra el usuario, retorna null
    return await usuario.destroy(); // Elimina el usuario y retorna el resultado
  }

  async actualizarIdChatTelegramUsuario(id, id_chat) {
   
    const usuario = await Usuario.findByPk(id); // Busca el usuario por ID
    usuario.id_chat = id_chat;
    await usuario.save();
    return usuario;
  }

  async obtenerCargoPorId(id) {
    return await Cargo.findByPk(id);
  }

  async obtenerPorTrabajadorId(trabajador_id) {
    return await db.trabajadores.findByPk(trabajador_id);
  }
}

module.exports = SequelizeUsuarioRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
