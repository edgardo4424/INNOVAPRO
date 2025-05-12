export function parsearError(error) {
    if (error.response?.data?.mensaje) {
      return error.response.data.mensaje;
    }
  
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
  
    if (error.message) {
      return error.message;
    }
  
    return "Ocurrió un error inesperado.";
  }
  