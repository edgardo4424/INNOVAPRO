const sequelizeUsuarioRepository = require('../../infrastructure/repositories/sequelizeUsuarioRepository'); // Importamos el repositorio de usuarios

const crearUsuario = require('../../application/useCases/crearUsuario'); // Importamos el caso de uso para crear un Usuario
const obtenerUsuarios = require('../../application/useCases/obtenerUsuarios'); // Importamos el caso de uso para obtener todos los Usuarios
const obtenerUsuarioPorId = require('../../application/useCases/obtenerUsuarioPorId'); // Importamos el caso de uso para obtener un Usuario por ID
const actualizarUsuario = require('../../application/useCases/actualizarUsuario'); // Importamos el caso de uso para actualizar un Usuario
const eliminarUsuario = require('../../application/useCases/eliminarUsuario'); // Importamos el caso de uso para eliminar un Usuario
const actualizarIdChatTelegramUsuario = require('../../application/useCases/actualizarIdChatTelegramUsuario');
const obtenerTrabajadoresSinUsuario = require('../../application/useCases/obtenerTrabajadoresSinUsuario');

const usuarioRepository = new sequelizeUsuarioRepository(); // Instancia del repositorio de usuarios

const UsuarioController = {
    async crearUsuario(req, res) {
        try {
          
            const nuevoUsuario = await crearUsuario(req.body, usuarioRepository ); // Llamamos al caso de uso para crear un usuario
            res.status(nuevoUsuario.codigo).json(nuevoUsuario.respuesta); // Respondemos con el usuario creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerUsuarios(req, res) {
        try {
            const usuarios = await obtenerUsuarios(usuarioRepository); // Llamamos al caso de uso para obtener todos los usuarios
            res.status(200).json({ usuarios: usuarios.respuesta || [] }); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerUsuarioPorId(req, res) {
        try {
            const usuario = await obtenerUsuarioPorId(req.params.id, usuarioRepository); // Llamamos al caso de uso para obtener un usuario por ID
            res.status(usuario.codigo).json(usuario.respuesta); // Respondemos con el usuario solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarUsuario(req, res) {
        try {
            const usuarioActualizado = await actualizarUsuario(req.params.id, req.body, usuarioRepository); // Llamamos al caso de uso para actualizar un usuario
            res.status(usuarioActualizado.codigo).json(usuarioActualizado.respuesta); // Respondemos con el usuario actualizado
        } catch (error) {
            
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarUsuario(req, res) {
        try {
            const usuarioEliminado = await eliminarUsuario(req.params.id, usuarioRepository); // Llamamos al caso de uso para eliminar un usuario
            res.status(usuarioEliminado.codigo).json(usuarioEliminado.respuesta); // Respondemos con el usuario eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

      async actualizarIdChatTelegramUsuario(req, res) {
        try {
            const usuarioActualizado = await actualizarIdChatTelegramUsuario(req.params.id, req.body, usuarioRepository); // Llamamos al caso de uso para eliminar un usuario
            res.status(usuarioActualizado.codigo).json(usuarioActualizado.respuesta); // Respondemos con el usuario eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },
    async  obtenerTrabajadoresSinUsuario(req, res) {
        try {
            const trabajadoresSinUsuario = await obtenerTrabajadoresSinUsuario(usuarioRepository); // Llamamos al caso de uso para eliminar un usuario
            res.status(trabajadoresSinUsuario.codigo).json(trabajadoresSinUsuario.respuesta); // Respondemos con el usuario eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
        
    }
};

module.exports = UsuarioController; // Exportamos el controlador de usuarios