const { Cliente } = require("../models/clienteModel");
const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeClienteRepository {
    getModel() {
        return require('../models/clienteModel').Cliente; // Retorna el modelo de cliente
    }

    async crear(clienteData) {
          return await Cliente.create(clienteData);
      }
      

    async obtenerClientes() {
        return await Cliente.findAll({
            attributes: [
                "id", "razon_social", "tipo", "ruc", "dni", "telefono", "email",
                "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "fecha_creacion"
            ],
            include: [
                {
                    model: db.contactos,
                    through: { attributes: [] }, // Relación correcta con la tabla intermedia
                    as: "contactos_asociados",
                },
            ]
        }); // Llama al método del repositorio para obtener todos los clientes
    }

    async obtenerPorId(id) {
        return await Cliente.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async actualizarCliente(id, clienteData) {
        const cliente = await Cliente.findByPk(id); // Busca el cliente por ID
        if (!cliente) { // Si no se encuentra el cliente, retorna null
          console.log("❌ Cliente no encontrado");
          return null; 
        }
        await cliente.update(clienteData); // Actualiza el cliente con los nuevos datos
        return cliente; // Retorna el cliente actualizado
      }

    async eliminarCliente(id) {
        const cliente = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el cliente por ID
        if (!cliente) return null; // Si no se encuentra el cliente, retorna null
        return await cliente.destroy(); // Elimina el cliente y retorna el resultado
    }
}

module.exports = SequelizeClienteRepository; // Exporta la clase para que pueda ser utilizada en otros módulos