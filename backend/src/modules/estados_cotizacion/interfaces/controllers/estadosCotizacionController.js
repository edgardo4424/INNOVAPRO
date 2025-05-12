const sequelizeEstadosCotizacionRepository = require('../../infrastructure/repositories/sequelizeEstadosCotizacionRepository'); // Importamos el repositorio de piezas

const obtenerEstadosCotizacion = require('../../application/useCases/obtenerEstadosCotizacion'); // Importamos el caso de uso para obtener todas las piezas

const estadosCotizacionRepository = new sequelizeEstadosCotizacionRepository(); // Instancia del repositorio de stock

const PiezaController = {

    async obtenerEstadosCotizacion(req, res) {
        try {
            
            const estadosCotizacion = await obtenerEstadosCotizacion(estadosCotizacionRepository); // Llamamos al caso de uso para obtener los estados de cotizacion
            res.status(200).json(estadosCotizacion.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },


};

module.exports = PiezaController; // Exportamos el controlador de stock