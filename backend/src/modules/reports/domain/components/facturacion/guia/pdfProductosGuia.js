function pdfProductosGuia(
  guia,
  bg_color = "#DCDBDB",
  innova_border = "#DCDBDB",
  margin_content = [0, 0, 0, 0]
) {
  const cantidad_total = guia.guia_detalles?.reduce((acc, d) => {
    if (d.unidad === "NIU") {
      return acc + Number(d.cantidad ?? 0);
    }
    return acc;
  }, 1);

  const body = [
    // ✅ Cabecera
    [
      { text: "ITEM", style: "tableHeaderMain", fillColor: bg_color, alignment: "center" },
      { text: "DESCRIPCION", style: "tableHeaderMain", fillColor: bg_color, alignment: "center" },
      { text: "UNI.", style: "tableHeaderMain", fillColor: bg_color, alignment: "center" },
      { text: "CANTIDAD", style: "tableHeaderMain", fillColor: bg_color, alignment: "center" },
    ],
    // ✅ Filas con sombreado alternado
    ...(guia.guia_detalles?.length
      ? guia.guia_detalles.map((d, index) => {
          const isEven = index % 2 === 0;
          return [
            {
              text: d.cod_Producto || "—",
              style: "tableBody",
              alignment: "center",
              fillColor: isEven ? "#FFFFFF" : "#DCDBDB",
            },
            {
              text: d.descripcion || "—",
              style: "tableBody",
              alignment: "left",
              fillColor: isEven ? "#FFFFFF" : "#DCDBDB",
            },
            {
              text: d.unidad || "—",
              style: "tableBody",
              alignment: "center",
              fillColor: isEven ? "#FFFFFF" : "#DCDBDB",
            },
            {
              text: d.cantidad || "—",
              style: "tableBody",
              alignment: "center",
              fillColor: isEven ? "#FFFFFF" : "#DCDBDB",
            },
          ];
        })
      : []),
    // ✅ Fila total sin bordes
    [
      { text: "", style: "tableBody", alignment: "center", border: [false, false, false, false] },
      { text: "", style: "tableBody", alignment: "center", border: [false, false, false, false] },
      { text: "", style: "tableBody", alignment: "center", border: [false, false, false, false] },
      {
        text: `${cantidad_total}`,
        style: "tableHeaderMain",
        fillColor: bg_color,
        alignment: "center",
        border: [false, false, false, false],
      },
    ],
  ];

  return {
    stack: [
      {
        table: {
          widths: ["10%", "70%", "10%", "10%"],
          body,
        },
        layout: {
          // ✅ Quitamos bordes visibles completamente
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
    ],
  };
}

module.exports = { pdfProductosGuia };
