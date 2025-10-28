function clasificar_stock(lista) {
  let hayNegativos = false;
  let hayPositivos = false;

  for (const item of lista) {
    if (item.cantidad < 0) {
      hayNegativos = true;
      break; // Prioridad al STOCK-EXCEDIDO
    } else if (item.cantidad > 0) {
      hayPositivos = true;
    }
  }

  if (hayNegativos) {
    return "STOCK-EXCEDIDO";
  } else if (hayPositivos) {
    return "STOCK-INCOMPLETO";
  } else {
    return "STOCK-COMPLETO";
  }
}
module.exports = clasificar_stock;
