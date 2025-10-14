const verificarEstadoSunat = require("../../application/verificarEstadoSunat");

const sequelizFactilizaRepository = require("../../infrastructure/repositories/sequelizeFactilizaRepository");

const factilizaRepository = new sequelizFactilizaRepository()


const factilizaController = {

    async verificarEstadoSunat(req, res) {
        try {
            const { codigo, respuesta } = await verificarEstadoSunat(req.body, factilizaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })

        }
    },

}

module.exports = factilizaController;