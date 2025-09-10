
function unificarTrabajadoresTipoPlanillaQuincenal(data) {
  const trabajadoresMap = {};

  for (const item of data) {
    const id = item.trabajador_id;

    if (!trabajadoresMap[id]) {
      // Primer registro → lo guardamos y guardamos copia original
      trabajadoresMap[id] = {
        ...item,
        detalle: null,
        __original: { ...item },
      };
    } else {
      const t = trabajadoresMap[id];

      // Guardar el primer registro si es la primera vez que hay repetidos
      if (t.detalle === null) {
        t.detalle = [t.__original];
      }

       // Acumulamos los valores sumables
      t.dias_laborados += item.dias_laborados;
      t.sueldo_quincenal += item.sueldo_quincenal;
      t.sueldo_bruto += item.sueldo_bruto;
      t.onp += item.onp;
      t.afp += item.afp;
      t.seguro += item.seguro;
      t.comision += item.comision;
      t.quinta_categoria += item.quinta_categoria;
      t.total_descuentos += item.total_descuentos;
      t.adelanto_sueldo += item.adelanto_sueldo;
      t.total_a_pagar += item.total_a_pagar;
   

      // Tomamos el sueldo_base y asignación familiar más altos
      t.sueldo_base = Math.max(t.sueldo_base, item.sueldo_base);
      t.asignacion_familiar = Math.max(t.asignacion_familiar, item.asignacion_familiar);

      // Tomamos los datos finales del último contrato
      t.numero_cuenta = item.numero_cuenta;
      t.banco = item.banco;
      t.tipo_afp = item.tipo_afp;
      t.contrato_id = item.contrato_id;
      t.fecha_fin = item.fecha_fin;

      // Agregar nuevo item al detalle
      t.detalle.push({ ...item });
    }
  }

  // Convertimos a array y ajustamos campos
  return Object.values(trabajadoresMap).map((t) => {
  const { __original, detalle, ...rest } = t;

  return {
    ...rest,
    registro_planilla_quincenal_detalle: detalle || null, // si hubo detalle, lo pone; si no, null
  };
});
}


module.exports = { unificarTrabajadoresTipoPlanillaQuincenal };
