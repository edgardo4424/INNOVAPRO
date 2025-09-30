
const crearNotaCreditoDebito = require('../../application/useCases/nota-debito-credito/crearNotaCreditoDebito');

const SequelizeBorradorRepository = require('../../infrastructure/repositories/sequelizeBorradorRespository')

const obtenerNotaDetallada = require('../../application/useCases/nota-debito-credito/obtenerNotaDetallada');

const obtenerNotasFiltrada = require('../../application/useCases/nota-debito-credito/obtenerNotasFiltrada');

const obtenerCorrelativo = require('../../application/useCases/nota-debito-credito/obtenerCorrelativo');

const SequelizeNotaCreditoDebitoRepository = require('../../infrastructure/repositories/sequelizeNotasCreditoDebito');

const notaRepository = new SequelizeNotaCreditoDebitoRepository();

const borradorRepository = new SequelizeBorradorRepository()


const notaController = {
    async crearNota(req, res) {
        try {
            const { codigo, respuesta } = await crearNotaCreditoDebito(req.body, notaRepository, borradorRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async obtenerNotaDetallada(req, res) {
        // * Controlador para obtener una Nota detallada ,
        // * recibe la serie, correlativo, ruc y tipo del documento de la Nota por parametro y llamar al caso de uso
        // * "obtenerNotaDetallada" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerNotaDetallada(req.body, notaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async obtenerNotas(req, res) {
        // * Controlador para obtener todas las facturas, se encarga de llamar al caso de uso
        // * "obtenerTodasLasFacturas" y devolver su respuesta
        // * el resultado sera filtrado segun el query
        try {
            // const { tipo, page = 1, limit = 10, num_doc, tip_doc, fec_des, fec_ast } = req.query;
            const { codigo, respuesta } = await obtenerNotasFiltrada(req.query, notaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerCorrelativo(req, res) {
        // * Controlador para obtener el correlativo de la nota
        // * se encarga de llamar al caso de uso
        // * "obtenerCorrelativo" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(req.body, notaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

}

module.exports = notaController;
