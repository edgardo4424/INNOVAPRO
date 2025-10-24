const sequelize = require("../../config/db");
const obtenerPiezaPorItem = require("../../modules/piezas/application/useCases/obtenerPiezaPorItem");
const SequelizePiezaRepository = require("../../modules/piezas/infrastructure/repositories/sequelizePiezaRepository");
const piezaRepository=new SequelizePiezaRepository()
module.exports = async function registrarTrabajadorConContrato(data) {
   const t = await sequelize.transaction();
   const piezas=data.piezas;
   for (const pieza of piezas) {
        const pieza_obtenida= await obtenerPiezaPorItem(pieza.cod_Producto,piezaRepository,t);
        if(pieza_obtenida.codigo!==200){
            throw new Error(`La pieza ${pieza.descripcion} no existe en el sistema`)
        }
   }



   //Obtener las piezas de la guia de remision,
   //Verificar que cada pieza enviada exista en la tablla pieza, Listo
   //Realizar el descuento en la tabla stock ("Stock general de innova ")
   //Crear un registro en la tabla pedidos_guias en estado Emitido
   //crear los registro en la tabla stock_pedidos_piezas  de cada pieza 
   //Crear los registro en la tabla movimeinto_stock_pedidos_piezas,

      //Crear la guia de remision;
   //Obtener el id de la guia de remision creada;


   //Actualizar un registro en la tabla pedidos_guias en estado Emitido


}