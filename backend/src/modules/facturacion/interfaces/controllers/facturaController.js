const SequelizeFacturaRepository = require('../../infrastructure/repositories/sequelizeFacturaRepository')

const obtenerTodasLasFacturas = require('../../application/useCases/obtenerTodasLasFacturas')

const facturaRepository = new SequelizeFacturaRepository()

const facturaController = {
    async obtenerFacturas(_,res){
        try {
            console.log("holas")
            const {codigo,respuesta} = await obtenerTodasLasFacturas(facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}

module.exports = facturaController;