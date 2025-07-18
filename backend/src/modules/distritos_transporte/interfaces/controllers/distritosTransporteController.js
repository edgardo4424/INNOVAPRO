const sequelizeDistritosTransporteRepository = require('../../infrastructure/repositories/sequelizeDistritosTransporteRepository'); 

const obtenerDistritosTransporte = require('../../application/useCases/obtenerDistritosTransporte');

const distritosTransporteRepository = new sequelizeDistritosTransporteRepository();

const DistritosTransporteController = {

    async obtenerDistritosTransporte(req, res) {
        try {
          
            const distritosTransporte = await obtenerDistritosTransporte(distritosTransporteRepository);
            res.status(200).json(distritosTransporte.respuesta); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = DistritosTransporteController; 