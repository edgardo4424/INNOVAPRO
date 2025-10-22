const path = require("path");

/**
 * Resuelve la carpeta física donde guardamos y servimos archivos públicos.
 * Usamos __dirname relativo al backend para no depender de process.cwd().
 */
const STORAGE_ROOT = path.resolve(__dirname, "..", "..", "storage");

/** Subcarpeta para documentos de contratos */
const CONTRATOS_DIR = path.join(STORAGE_ROOT, "documentos", "contratos");

module.exports = {
  STORAGE_ROOT,
  CONTRATOS_DIR,
};