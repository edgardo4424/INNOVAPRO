

const sequelizeMotivosLiquidacionRepository = require('../../infrastructure/repositories/sequelizeMotivosLiquidacionRepository'); 
const motivosLiquidacionRepository = new sequelizeMotivosLiquidacionRepository();

const obtenerMotivosLiquidacion = require('../../application/useCases/obtenerMotivosLiquidacion');

const MotivosLiquidacionController = {
   
    async obtenerMotivosLiquidacion(req, res) {

        try {

            const response = await obtenerMotivosLiquidacion(motivosLiquidacionRepository); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    

};

module.exports = MotivosLiquidacionController; 