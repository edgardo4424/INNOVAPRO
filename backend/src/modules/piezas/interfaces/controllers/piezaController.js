const sequelizePiezaRepository = require('../../infrastructure/repositories/sequelizePiezaRepository'); // Importamos el repositorio de piezas

const crearPieza = require('../../application/useCases/crearPieza'); 
const obtenerPiezas = require('../../application/useCases/obtenerPiezas'); // Importamos el caso de uso para obtener todas las piezas
const obtenerPiezaPorId = require('../../application/useCases/obtenerPiezaPorId'); // Importamos el caso de uso para obtener una pieza por ID
const actualizarPieza = require('../../application/useCases/actualizarPieza'); // Importamos el caso de uso para actualizar una pieza
const eliminarPieza = require('../../application/useCases/eliminarPieza'); // Importamos el caso de uso para eliminar una pieza


const piezaRepository = new sequelizePiezaRepository(); // Instancia del repositorio de stock

const PiezaController = {

    async crearPieza(req, res) {
            try {
                const nuevoPieza = await crearPieza(req.body, piezaRepository ); // Llamamos al caso de uso para crear un pieza
               
                res.status(nuevoPieza.codigo).json(nuevoPieza.respuesta); // Respondemos con el pieza creado
            } catch (error) {
                console.log('error', error);
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },
    
    async obtenerPiezas(req, res) {
        try {
            
            const piezas = await obtenerPiezas(piezaRepository); // Llamamos al caso de uso para obtener las piezas
            res.status(200).json(piezas.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    
        async obtenerPiezaPorId(req, res) {
            try {
                const pieza = await obtenerPiezaPorId(req.params.id, piezaRepository); // Llamamos al caso de uso para obtener un pieza por ID
                res.status(pieza.codigo).json(pieza.respuesta); // Respondemos con el pieza solicitado
            } catch (error) {
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },
    
        async actualizarPieza(req, res) {
            try {
                const piezaActualizado = await actualizarPieza(req.params.id, req.body, piezaRepository); // Llamamos al caso de uso para actualizar un pieza
                
                res.status(piezaActualizado.codigo).json(piezaActualizado.respuesta); // Respondemos con el pieza actualizado
            } catch (error) {
                
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },
    
        async eliminarPieza(req, res) {
            try {
                const piezaEliminado = await eliminarPieza(req.params.id, piezaRepository); // Llamamos al caso de uso para eliminar un pieza
                res.status(piezaEliminado.codigo).json(piezaEliminado.respuesta); // Respondemos con el pieza eliminado
            } catch (error) {
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        }

};

module.exports = PiezaController; // Exportamos el controlador de stock