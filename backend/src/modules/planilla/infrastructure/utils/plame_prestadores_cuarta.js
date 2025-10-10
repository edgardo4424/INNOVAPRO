const plame_prestadores_cuarta = async (t,) => {

    const tipo_documento = t.tipo_documento == "CE" ? "04" : "01";
    const apellidos = t.apellidos.split(" ");
    const domiciliado = t.domiciliado;
    const convenio = "0";
    return `${tipo_documento}|${t.numero_documento}|${apellidos[0]}|${apellidos[1]}|${t.nombres}|${domiciliado}|${convenio}`;


};

module.exports = plame_prestadores_cuarta;
