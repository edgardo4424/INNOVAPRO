const obtenerCargosArea = (rol) => {
  const obj = {};
  console.log('rol obtenido',rol);
  
  switch (rol) {
    case "Gerente de administración":
      obj.area_id = 1;
      obj.cargos_id = [2,13];
      // Area:Administracion,Legal,Marketing
      // Cargos: gerente de admin, abogada
      break;
    case "Gerente de comercialización":
      obj.area_id = 9;
      obj.cargos_id = [3];
      //Areas: ventas
      break;
    case "Jefe de OT":
      obj.area_id = 7;
      obj.cargos_id = [];
      //Areas: ot 
      break;
    case "Jefa de Almacén":
      obj.area_id = 2;
      obj.cargos_id = [];
      //Almacen
      break;
    case "Jefe montadores y operadores":
      obj.area_id = 6;
      obj.cargos_id = [];
      //Montadores
      break;
    case "Jefe TI":
      obj.area_id = 8;
      obj.cargos_id = [];
      //Areas: ti
      break;
    default:
      return null;
  }
// Marketing , TI Gerencia,Legal
  return obj;
};

module.exports = obtenerCargosArea;

