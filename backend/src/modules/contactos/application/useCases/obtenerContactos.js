module.exports = async (contactoRepository) => {
    const contactos = await contactoRepository.obtenerContactos(); // Llama al método del repositorio para obtener todos los contactos
    return { codigo: 200, respuesta: contactos } 
} // Exporta la función para que pueda ser utilizada en otros módulos