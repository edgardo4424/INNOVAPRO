const obtenerCargosArea = (rol) => {
  const obj = {};
  console.log('rol obtenido',rol);
  
  switch (rol) {
    case "Gerente de administración":
      obj.area_id = 1;
      obj.cargos_id = [2];
      // Area:administracion
      // Cargos: gerente de admin, abogada
      break;
    case "Gerente de comercialización":
      obj.area_id = 9;
      obj.cargos_id = [3];
      break;
    case "Jefe de OT":
      obj.area_id = 7;
      obj.cargos_id = [];
      break;
    case "Jefa de Almacén":
      obj.area_id = 2;
      obj.cargos_id = [];
      break;
    case "Jefe montadores y operadores":
      obj.area_id = 6;
      obj.cargos_id = [];
      break;
    default:
      return null; // o puedes retornar obj si prefieres un objeto vacío
  }
// Marketing , TI Gerencia,Legal
  return obj;
};

module.exports = obtenerCargosArea;
