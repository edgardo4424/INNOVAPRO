// Utilidad para justificación profesional con negrita y subrayado

/**
 * Justifica un párrafo de texto en PDF al estilo Word, con soporte para negrita (**texto**),
 * subrayado (__texto__), o ambos combinados (**__texto__**).
 * 
 * @param {jsPDF} doc - Instancia de jsPDF.
 * @param {string} text - Texto a justificar.
 * @param {number} x - Posición X inicial.
 * @param {number} y - Posición Y inicial.
 * @param {number} maxWidth - Ancho máximo permitido para la línea.
 * @param {number} lineHeight - Altura entre líneas.
 * @param {number} fontSize - Tamaño de fuente.
 * @returns {number} - Y final luego de dibujar el texto.
 */

export function drawJustifiedText(doc, text, x, y, maxWidth, lineHeight = 4.5, fontSize = 8) {
  const words = parseStyledWords(text);
  const spaceWidth = doc.getTextWidth(" ");
  let line = [];
  let lineWidth = 0;
  let outputY = y;

  doc.setFontSize(fontSize);

  for (let i = 0; i < words.length; i++) {
    const { text: wordText } = words[i];
    const wordWidth = doc.getTextWidth(wordText);

    if (lineWidth + wordWidth + spaceWidth * line.length > maxWidth && line.length > 0) {
      const totalWordsWidth = line.reduce((sum, w) => sum + doc.getTextWidth(w.text), 0);
      const extraSpace = (line.length - 1 > 0) ? (maxWidth - totalWordsWidth) / (line.length - 1) : 0;

      let offsetX = x;
      for (let j = 0; j < line.length; j++) {
        const word = line[j];
        applyTextStyle(doc, word);
        doc.text(word.text, offsetX, outputY);

        if (word.underline) {
          const textWidth = doc.getTextWidth(word.text);
          doc.line(offsetX, outputY + 0.7, offsetX + textWidth, outputY + 0.7);
        }

        offsetX += doc.getTextWidth(word.text) + (j < line.length - 1 ? extraSpace : 0);
      }

      outputY += lineHeight;
      line = [words[i]];
      lineWidth = wordWidth;
    } else {
      line.push(words[i]);
      lineWidth += wordWidth;
    }
  }

  // Última línea (sin justificar)
  if (line.length > 0) {
    let offsetX = x;
    for (let j = 0; j < line.length; j++) {
      const word = line[j];
      applyTextStyle(doc, word);
      doc.text(word.text, offsetX, outputY);

      if (word.underline) {
        const textWidth = doc.getTextWidth(word.text);
        doc.line(offsetX, outputY + 0.7, offsetX + textWidth, outputY + 0.7);
      }

      offsetX += doc.getTextWidth(word.text) + spaceWidth;
    }
    outputY += lineHeight;
  }

  doc.setFont("helvetica", "normal"); // restaurar
  return outputY;
}

function applyTextStyle(doc, word) {
  doc.setFont("helvetica", word.bold ? "bold" : "normal");
}

function parseStyledWords(text) {
  const words = [];
  let buffer = '';
  let isBold = false;
  let isUnderline = false;
  let inStyle = false;
  let currentStyle = null;

  const tokens = text.match(/(\*\*__.*?__\*\*|__\*\*.*?\*\*__|\*\*.*?\*\*|__.*?__|\S+)/g);

  for (let token of tokens) {
    let bold = false;
    let underline = false;
    let cleanText = token;

    // Detectar negrita + subrayado
    if (/^\*\*__.*__\*\*$/.test(token) || /^__\*\*.*\*\*__$/.test(token)) {
      bold = true;
      underline = true;
      cleanText = token.replace(/\*\*|__/g, "");
    } else if (/^\*\*.*\*\*$/.test(token)) {
      bold = true;
      cleanText = token.replace(/\*\*/g, "");
    } else if (/^__.*__$/.test(token)) {
      underline = true;
      cleanText = token.replace(/__/g, "");
    }

    words.push({
      text: cleanText,
      bold,
      underline,
    });
  }

  return words;
}

export function renderTextoConNegrita(doc, texto, x, y, fontSize = 10) {
  doc.setFontSize(fontSize);

  // Detectar espacios o tabulaciones al inicio
  const espaciosIniciales = texto.match(/^(\s*)/)?.[0] || "";
  const textoSinEspacios = texto.slice(espaciosIniciales.length);
  const indentExtra = doc.getTextWidth(" ") * espaciosIniciales.length;

  let cursorX = x + indentExtra;

  const partes = textoSinEspacios.split(/(\*\*[^*]+\*\*)/);

  for (let parte of partes) {
    if (!parte) continue;

    if (/^\*\*.+\*\*$/.test(parte)) {
      const textoNegrita = parte.replace(/\*\*/g, "");
      doc.setFont("helvetica", "bold");
      doc.text(textoNegrita, cursorX, y);
      cursorX += doc.getTextWidth(textoNegrita);
    } else {
      doc.setFont("helvetica", "normal");
      doc.text(parte, cursorX, y);
      cursorX += doc.getTextWidth(parte);
    }
  }
}