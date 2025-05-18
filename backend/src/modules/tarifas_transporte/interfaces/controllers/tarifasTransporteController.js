const sequelizeTarifasTransporteRepository = require('../../infrastructure/repositories/sequelizeTarifasTransporteRepository'); // Importamos el repositorio de tarifas transporte

const obtenerTarifasTransporte = require('../../application/useCases/obtenerTarifasTransporte'); // Importamos el caso de uso para obtener todos los tarifas transporte

const tarifasTransporteRepository = new sequelizeTarifasTransporteRepository(); // Instancia del repositorio de tarifas transporte

const TarifasTransporteController = {

    async obtenerTarifasTransporte(req, res) {
        try {
            const tarifasTransporte = await obtenerTarifasTransporte(tarifasTransporteRepository); // Llamamos al caso de uso para obtener todos los tarifasTransporte
           
            res.status(200).json(tarifasTransporte.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = TarifasTransporteController; // Exportamos el controlador de tarifasTransporte