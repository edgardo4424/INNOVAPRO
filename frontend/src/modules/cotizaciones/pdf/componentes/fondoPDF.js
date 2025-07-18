import fondoPlantilla from "../../assets/PlantillaIMG.png";

let fondoBase64 = null;

export async function renderFondoPDF(doc) {
  // Asegurar que el base64 esté cargado
  if (!fondoBase64) {
    fondoBase64 = await cargarImagenComoBase64(fondoPlantilla);
  }

  // Alias único para evitar conflictos entre instancias
  const alias = "FONDO_IMG";

  // Verifica si ya se ha registrado esta imagen en el doc actual
  if (!doc.__fondoRegistrado) {
    doc.addImage(fondoBase64, "PNG", 0, 0, 210, 297, alias, "FAST");
    doc.__fondoRegistrado = true;
  } else {
    try {
      doc.addImage(alias, "PNG", 0, 0, 210, 297);
    } catch (e) {
      // Reintentar si no fue registrado correctamente por cualquier motivo
      doc.addImage(fondoBase64, "PNG", 0, 0, 210, 297, alias, "FAST");
    }
  }
}

function cargarImagenComoBase64(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Error cargando fondo"));
    img.src = src;
  });
}