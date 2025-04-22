const { formatearDomicilioSUNAT } = require("../infrastructure/utils/formateadorDomicilio");

describe("🧪 formatearDomicilioSUNAT", () => {
  const baseUbigeo = {
    distrito: "MIRAFLORES",
    provincia: "LIMA",
    departamento: "LIMA",
  };

  it("✅ Formatea correctamente con todos los campos", () => {
    const datos = {
      tipo_via: "AV.",
      nombre_via: "ALFREDO BENAVIDES",
      numero: "1579",
      interior: "602",
      lote: "",
      tipo_zona: "URB.",
      codigo_zona: "SAN JORGE",
      manzana: "",
      kilometro: "",
    };

    const resultado = formatearDomicilioSUNAT(datos, baseUbigeo);
    expect(resultado).toBe(
      "AV. ALFREDO BENAVIDES - NRO. 1579 - INT. 602 - SAN JORGE URB. - MIRAFLORES - LIMA - LIMA"
    );
  });

  it("✅ Omite campos vacíos correctamente", () => {
    const datos = {
      tipo_via: "JR.",
      nombre_via: "LOS PINOS",
      numero: "",
      interior: "",
      tipo_zona: "",
      codigo_zona: "",
      lote: "",
      manzana: "",
      kilometro: "",
    };

    const resultado = formatearDomicilioSUNAT(datos, baseUbigeo);
    expect(resultado).toBe("JR. LOS PINOS - MIRAFLORES - LIMA - LIMA");
  });

  it("✅ Devuelve string vacío si datos es null", () => {
    const resultado = formatearDomicilioSUNAT(null, baseUbigeo);
    expect(resultado).toBe("");
  });
});