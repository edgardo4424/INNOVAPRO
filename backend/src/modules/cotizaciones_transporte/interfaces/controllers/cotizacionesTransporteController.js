const sequelizeCotizacionesTransporteRepository = require('../../infrastructure/repositories/sequelizeCotizacionesTransporteRepository'); 

const obtenerCotizacionesTransporte = require('../../application/useCases/obtenerCotizacionesTransporte'); 
const calcularCostoTransporte = require('../../application/useCases/calcularCostoTransporte'); 

const cotizacionesTransporteRepository = new sequelizeCotizacionesTransporteRepository(); 

const CotizacionesTransporteController = {

    async obtenerCotizacionesTransporte(req, res) {
        try {
            const cotizacionesTransporte = await obtenerCotizacionesTransporte(cotizacionesTransporteRepository); 
           
            res.status(200).json(cotizacionesTransporte.respuesta); 
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    },

     async calcularCostoTransporte(req, res) {
        try {
            const costoTransporte = await calcularCostoTransporte(req.body, cotizacionesTransporteRepository); 
           
            res.status(costoTransporte.codigo).json(costoTransporte.respuesta); // Respondemos con el obra creado 
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); 
        }
    },

};

module.exports = CotizacionesTransporteController;