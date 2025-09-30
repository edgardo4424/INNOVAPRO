const plame_prestadores_cuarta = async (trabajadorRepository,rh) => {
  let prestadores_cuarta = [];
  for (const r of rh) {
    const t = await trabajadorRepository.obtenerTrabajadorSimplePorId(
      r.trabajador_id
    );
    const tipo_documento = r.tipo_documento == "CE" ? "04" : "01";
    const apellidos = t.apellidos.split(" ");
    const domiciliado = "1";
    const convenio = "0";
    const linea_construida = `${tipo_documento}|${r.numero_documento}|${apellidos[0]}|${apellidos[1]}|${t.nombres}|${domiciliado}|${convenio}`;
    prestadores_cuarta.push(linea_construida);
  }

  return {
    prestadores_cuarta,
  };
};

module.exports = plame_prestadores_cuarta;
