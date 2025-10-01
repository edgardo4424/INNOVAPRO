const crearGuia = require("../../application/useCases/guia-remision/crearGuia");

const obtenerCorrelativo = require("../../application/useCases/guia-remision/obtenerCorrelativo");
const obtenerGuiaDetallada = require("../../application/useCases/guia-remision/obtenerGuiaDetallada");

const obtenerGuias = require("../../application/useCases/guia-remision/obtenerGuias");

const obtenerGuiasPorRuc = require("../../application/useCases/guia-remision/obtenerGuiasPorRuc");

const SequelizeGuiaRemisionRepository = require("../../infrastructure/repositories/sequelizeGuiaRemisionRepository");

const guiaRepository = new SequelizeGuiaRemisionRepository();

const guiaRemisionController = {
    async crearGuiaRemision(req, res) {
        try {
            const { codigo, respuesta } = await crearGuia(req.body, guiaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerGuiasRemision(req, res) {
        try {
            const { codigo, respuesta } = await obtenerGuias(guiaRepository, req.query);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerCorrelativo(req, res) {
        // * Controlador para obtener el correlativo de la guia
        // * se encarga de llamar al caso de uso
        // * "obtenerCorrelativo" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(req.body, guiaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerRelacionesGuias(req, res) {
        try {
            
            const { codigo, respuesta } = await obtenerGuiasPorRuc(req.body, guiaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerGuiaDetallada(req, res) {
        // * Controlador para obtener una guia detallada ,
        // * recibe la serie, correlativo, ruc y tipo del documento de la guia por parametro y llamar al caso de uso
        // * "obtenerGuiaDetallada" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerGuiaDetallada(req.body, guiaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

}

module.exports = guiaRemisionController;