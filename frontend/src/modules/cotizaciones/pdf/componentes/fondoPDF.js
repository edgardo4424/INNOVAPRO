import fondo from "../../assets/PlantillaIMG.png";

export async function renderFondoPDF(doc) {
  const fondoImg = new Image();
  fondoImg.src = fondo;

  await new Promise((resolve) => {
    fondoImg.onload = () => {
      doc.addImage(fondoImg, "PNG", 0, 0, 210, 297); // A4 completo (tamaño estándar)
      resolve();
    };
  });
}
