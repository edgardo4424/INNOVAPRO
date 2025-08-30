const crearGuia = require("../../application/useCases/guia-remision/crearGuia");

const obtenerCorrelativo = require("../../application/useCases/guia-remision/obtenerCorrelativo");

const obtenerGuias = require("../../application/useCases/guia-remision/obtenerGuias");

const obtenerGuiasPorRuc = require("../../application/useCases/guia-remision/obtenerGuiasPorRuc");

const SequelizeGuiaRemisionRepository = require("../../infrastructure/repositories/sequelizeGuiaRemisionRepository");

const guiaRemisionRepository = new SequelizeGuiaRemisionRepository();

const guiaRemisionController = {
    async crearGuiaRemision(req, res) {
        try {
            const { codigo, respuesta } = await crearGuia(req.body, guiaRemisionRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerGuiasRemision(req, res) {
        try {
            const { codigo, respuesta } = await obtenerGuias(guiaRemisionRepository, req.query);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerCorrelativo(_, res) {
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(guiaRemisionRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerRelacionesGuias(req, res) {
        try {
            console.log(req.query)
            const { codigo, respuesta } = await obtenerGuiasPorRuc(req.query, guiaRemisionRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

}

module.exports = guiaRemisionController;