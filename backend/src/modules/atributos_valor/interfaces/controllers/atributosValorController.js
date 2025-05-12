const sequelizeAtributosValorRepository = require('../../infrastructure/repositories/sequelizeAtributosValorRepository'); // Importamos el repositorio de atributos

const obtenerAtributosValor = require('../../application/useCases/obtenerAtributosValor'); 
const crearAtributosValor = require('../../application/useCases/crearAtributosValor'); 

const atributosValorRepository = new sequelizeAtributosValorRepository(); // Instancia del repositorio de stock

const AtributoController = {

    async crearAtributosValor(req, res) {
            try {

                const nuevoAtributosValor = await crearAtributosValor(req.body, atributosValorRepository ); // Llamamos al caso de uso para crear un atributo valor
               
                res.status(nuevoAtributosValor.codigo).json(nuevoAtributosValor.respuesta); // Respondemos con el atributo valor creado
            } catch (error) {
                console.log('error', error);
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },

    async obtenerAtributosValor(req, res) {
        try {
            const atributosValor = await obtenerAtributosValor(atributosValorRepository); // Llamamos al caso de uso para obtener los atributos
            res.status(200).json(atributosValor.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = AtributoController; // Exportamos el controlador de atributo