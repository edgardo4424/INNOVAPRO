const { Documento } = require("../models/documentosModel");


class SequelizeDocumentoRepository {
  async crearDocumento(payload, transaction = null) {
    const documento_creado = await Documento.create(payload, { transaction });
    return documento_creado;
  }
  
  
}

module.exports = SequelizeDocumentoRepository;
