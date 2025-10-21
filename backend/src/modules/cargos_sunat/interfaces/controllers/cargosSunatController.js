

const sequelizeCargosSunatRepository = require('../../infrastructure/repositories/sequelizeCargosSunatRepository'); 
const cargosSunatRepository = new sequelizeCargosSunatRepository();

const obtenerCargosSunat = require('../../application/useCases/obtenerCargosSunat');
const obtenerTodosLosCargosSunat = require('../../application/useCases/obtenerTodosLosCargosSunat');

const CargosSunatController = {
   
    async obtenerCargosSunat(req, res) {

        try {
            const { cargo_innova_id } = req.body;

            const response = await obtenerCargosSunat(cargo_innova_id, cargosSunatRepository); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

      async obtenerTodosLosCargosSunat(req, res) {
    
            try {
              
                const response = await obtenerTodosLosCargosSunat(cargosSunatRepository); 
               
                res.status(response.codigo).json(response.respuesta); 
            } catch (error) {
                console.log('error',error);
                res.status(500).json({ error: error.message }); 
            }
        },
    

};

module.exports = CargosSunatController; 