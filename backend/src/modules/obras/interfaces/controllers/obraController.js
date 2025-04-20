const sequelizeObraRepository = require('../../infrastructure/repositories/sequelizeObraRepository'); // Importamos el repositorio de obras

const crearObra = require('../../application/useCases/crearObra'); // Importamos el caso de uso para crear un obra
const obtenerObras = require('../../application/useCases/obtenerObras'); // Importamos el caso de uso para obtener todos los obras
const obtenerObraPorId = require('../../application/useCases/obtenerObraPorId'); // Importamos el caso de uso para obtener un obra por ID
const actualizarObra = require('../../application/useCases/actualizarObra'); // Importamos el caso de uso para actualizar un obra
const eliminarObra = require('../../application/useCases/eliminarObra'); // Importamos el caso de uso para eliminar un obra

const obraRepository = new sequelizeObraRepository(); // Instancia del repositorio de obras

const ObraController = {
    async crearObra(req, res) {
        try {
            const datos = {
                ...req.body,
                creado_por: req.usuario.id
            }
            console.log('datos', datos);
            const nuevoObra = await crearObra(datos, obraRepository ); // Llamamos al caso de uso para crear un obra
           
            res.status(nuevoObra.codigo).json(nuevoObra.respuesta); // Respondemos con el obra creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerObras(req, res) {
        try {
            const obras = await obtenerObras(obraRepository); // Llamamos al caso de uso para obtener todos los obras
           
            res.status(200).json(obras.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerObraPorId(req, res) {
        try {
            const obra = await obtenerObraPorId(req.params.id, obraRepository); // Llamamos al caso de uso para obtener un obra por ID
            res.status(obra.codigo).json(obra.respuesta); // Respondemos con el obra solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarObra(req, res) {
        try {
            const obraActualizado = await actualizarObra(req.params.id, req.body, obraRepository); // Llamamos al caso de uso para actualizar un obra
            
            res.status(obraActualizado.codigo).json(obraActualizado.respuesta); // Respondemos con el obra actualizado
        } catch (error) {
            
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarObra(req, res) {
        try {
            const obraEliminado = await eliminarObra(req.params.id, obraRepository); // Llamamos al caso de uso para eliminar un obra
            res.status(obraEliminado.codigo).json(obraEliminado.respuesta); // Respondemos con el obra eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }

};

module.exports = ObraController; // Exportamos el controlador de obras