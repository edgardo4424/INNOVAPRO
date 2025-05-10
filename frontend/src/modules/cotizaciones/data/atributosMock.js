// INNOVA PRO+ v1.2.0

const atributosMock = [
    {
      id: 1,
      uso_id: 2,
      nombre: "LONGITUD (mm)",
      llave_json: "longitud",
      tipo_dato: "select",
      unidad_medida: "mm",
      orden: 1,
      opciones: [2572, 3072, 3572],
    },
    {
      id: 2,
      uso_id: 2,
      nombre: "ANCHO (mm)",
      llave_json: "ancho",
      tipo_dato: "select",
      unidad_medida: "mm",
      orden: 2,
      opciones: [1020, 1090],
    },
    {
      id: 3,
      uso_id: 2,
      nombre: "ALTURA ANDAMIO (m)",
      llave_json: "altura",
      tipo_dato: "input",
      unidad_medida: "m",
      orden: 3,
    },
    {
      id: 4,
      uso_id: 2,
      nombre: "TIPO DE APOYO",
      llave_json: "tipoApoyo",
      tipo_dato: "select",
      unidad_medida: "",
      orden: 4,
      opciones: ["GARRUCHA", "FIJO"],
    },
  ];
  
  export default atributosMock;  