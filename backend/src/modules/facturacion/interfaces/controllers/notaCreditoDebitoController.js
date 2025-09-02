
const crearNotaCreditoDebito = require('../../application/useCases/nota-debito-credito/crearNotaCreditoDebito');

const SequelizeNotaCreditoDebitoRepository = require('../../infrastructure/repositories/sequelizeNotasCreditoDebito');

const notaCreditoDebitoRepository = new SequelizeNotaCreditoDebitoRepository();

const notaCreditoDebitoController = {
    async crearNotaCreditoDebito(req, res) {
        try {
            console.log(req.body)
            const { codigo, respuesta } = await crearNotaCreditoDebito(req.body, notaCreditoDebitoRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = notaCreditoDebitoController;