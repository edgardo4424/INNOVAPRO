const SequelizeBorradorRepository = require('../../infrastructure/repositories/sequelizeBorradorRespository')

const crearBorrador = require('../../application/useCases/borrador/crearBorrador')

const obtenerBorrador = require('../../application/useCases/borrador/obtenerBorradores')

const obtenerBorradorPorId = require('../../application/useCases/borrador/obtenerBorradorPorId')

const eliminarBorrador = require('../../application/useCases/borrador/eliminarBorrador')

const borradorRepository = new SequelizeBorradorRepository()

const borradorController={

    async crearBorrador(req, res) {
        try {
            const { body } = req
            const { codigo, respuesta } = await crearBorrador(body, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async obtenerBorrador(req, res) {
        try {
            
            const { codigo, respuesta } = await obtenerBorrador(borradorRepository,req.query)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },
    async obtenerBorradorPorId(req, res) {
        try {
            const { id } = req.params
            const { codigo, respuesta } = await obtenerBorradorPorId(id, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },
    async eliminarBorrador(req, res) {
        try {
            const { id } = req.params
            const { codigo, respuesta } = await eliminarBorrador(id, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })

        }
    },

}

module.exports = borradorController;