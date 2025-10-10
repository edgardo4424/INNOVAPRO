class Trabajador {
  constructor({
    id,
    nombres,
    apellidos,
    numero_documento,
    telefono,
    sueldo_base,
    asignacion_familiar,
    sistema_pension,
    tipo_documento,
    cargo_id,
    domiciliado,
    tipo_afp,
    comision_afp,
    fecha_baja,
    contratos_laborales,
    fecha_nacimiento,
    cuspp_afp,
    estado_civil,
    ruc
  }) {
    (this.id = id),
      (this.nombres = nombres),
      (this.apellidos = apellidos),
      (this.tipo_documento = tipo_documento),
      (this.numero_documento = numero_documento),
      (this.telefono = telefono),
      (this.sueldo_base = sueldo_base),
      (this.asignacion_familiar = asignacion_familiar),
      (this.sistema_pension = sistema_pension),
      (this.cargo_id = cargo_id);
    this.domiciliado = domiciliado;
    this.tipo_afp = tipo_afp;
    this.comision_afp = comision_afp;
    this.fecha_baja = fecha_baja;
    this.contratos_laborales = contratos_laborales;
    this.fecha_nacimiento = fecha_nacimiento;
    this.cuspp_afp = cuspp_afp;
    this.estado_civil = estado_civil;
    this.ruc=ruc
  }

  validarCamposObligatorios(editar = false) {
    const errores = [];

    if (editar) {
      if (!this.id) {
        errores.push("El id es inválido");
      }
    }
    if (!this.nombres || !this.apellidos) {
      errores.push("Nombres o apellidos invalidos");
    }
    if (this.tipo_documento !== "DNI" && this.tipo_documento !== "CE") {
      errores.push("El tipo de documento es invalido");
    }
    if (!this.numero_documento || !this.numero_documento.trim()) {
      errores.push("Número de documento inválido");
    }
    if (!this.telefono || !this.telefono.trim()) {
      errores.push("Número de teléfono inválido");
    }
    /*  if (this.sueldo_base < 1130) {
         errores.push("El sueldo base es invalido");
      } */
    if (this.domiciliado === null || this.domiciliado === undefined) {
      errores.push("Dato domiciliado inválida");
    }
    if (this.asignacion_familiar === undefined) {
      errores.push("Asignacion familiar inválida");
    }

    if (!this.estado_civil) {
      errores.push("El estado civil es obligatorio");
    }

    if (
      !this.fecha_nacimiento ||
      new Date(this.fecha_nacimiento) > new Date()
    ) {
      errores.push("Fecha de nacimiento inválida");
    }

    if (this.cargo_id === null) {
      errores.push("El cargo no se a enviado");
    }

    if (this.contratos_laborales.length === 0) {
      errores.push("El trabajador debe tener al menos un contrato laboral");
    }

    // Verificar si es que tiene en la lista de contratos laborales la fecha_fin es "" o null
    // dejar insertar el trabajador

    console.log("this.contratos_laborales", this.contratos_laborales);

    const contratosIndefnidosPorFilial = this.contratos_laborales.filter(
      (contrato) => contrato.es_indefinido === true
    );

    console.log('contratosIndefnidosPorFilial', contratosIndefnidosPorFilial);
    const contratosIndefinidosPorFilialMapeados =
      contratosIndefnidosPorFilial.map((contrato) => ({
        ...contrato,
        fecha_fin: contrato.es_indefinido ? null : (contrato.fecha_fin == "" ? null : contrato.fecha_fin) // puede ser null por ser contrato indefinido
      }));
    // Piede tener varios contratos indefinidos si es que son de diferentes filiales

    console.log('contratosIndefinidosPorFilialMapeados', contratosIndefinidosPorFilialMapeados);
    const listaIdsContratosIndefinidos = [];
    for (const contrato of contratosIndefinidosPorFilialMapeados) {
      console.log("contrato", contrato);
      if (listaIdsContratosIndefinidos.includes(contrato.filial_id)) {
        errores.push(
          "No se puede tener más de un contrato laboral indefinido para la misma filial"
        );
        return errores;
      }
      listaIdsContratosIndefinidos.push(contrato.filial_id);
    }

    console.log("listaIdsContratosIndefinidos", listaIdsContratosIndefinidos);

    const hoy = new Date().toISOString().split("T")[0];

    const c_a = this.contratos_laborales.filter((c) => {
      if (c.es_indefinido) {
        return true;
      }
      return c.fecha_inicio <= hoy && hoy <= c.fecha_fin;
    });
    console.log("c_a", c_a);
    if (c_a.length === 0) {
      errores.push(
        "No se encontró un contrato laboral vigente para la fecha actual."
      );
      return errores;
    }

    const minimoUnContratoPlanilla = c_a.some((c) => c.tipo_contrato === "PLANILLA");


    if (minimoUnContratoPlanilla) {
         if (this.sistema_pension !== "AFP" && this.sistema_pension !== "ONP") {
            errores.push("El sistema de pension es inválido.");
         }
         if (this.sistema_pension === "AFP") {
            if (
               ["HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"].includes(
                  this.tipo_afp
               ) === false
            ) {
               errores.push("El tipo de AFP es inválido");
            }

         }
         if (this.sistema_pension === "ONP") {
            this.comision_afp = false;
         }
      } else {
         this.sistema_pension = null;
         this.tipo_afp = null;
         this.comision_afp = false;
         this.cuspp_afp = null;

      } 

    return errores;
  }

  get(editar = false) {
    const datos = {
      nombres: this.nombres,
      apellidos: this.apellidos,
      tipo_documento: this.tipo_documento,
      numero_documento: this.numero_documento,
      telefono: this.telefono,
      sueldo_base: this.sueldo_base,
      asignacion_familiar: this.asignacion_familiar,
      sistema_pension: this.sistema_pension || null,
      cargo_id: this.cargo_id,
      domiciliado: this.domiciliado,
      tipo_afp: this.tipo_afp,
      comision_afp: this.comision_afp,
      fecha_baja: this.fecha_baja,
      fecha_nacimiento: this.fecha_nacimiento,
      cuspp_afp: this.cuspp_afp,
      estado_civil: this.estado_civil,
      ruc:this.ruc
    };
    if (editar) {
      datos.trabajador_id = this.id;
    }

    return datos;
  }
}

module.exports = Trabajador;
