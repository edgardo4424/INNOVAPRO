
const { BajasTrabajadores } = require("../models/BajasTrabajadoresModel");

class SequelizeDarBajaTrabajadorRepository {
   async insertarRegistroBajaTrabajador(dataBody, transaction=null) {
     
    const registroBajaTrabajador = await BajasTrabajadores.create(dataBody, { transaction });

    return registroBajaTrabajador;
   }
}

module.exports = SequelizeDarBajaTrabajadorRepository;
