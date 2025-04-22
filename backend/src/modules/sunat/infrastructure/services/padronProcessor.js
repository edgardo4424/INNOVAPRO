const axios = require("axios");
const unzipper = require("unzipper");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const iconv = require("iconv-lite");
const mysql = require("mysql2/promise");
const cron = require("node-cron");
const ejecutarImportacionSUNAT = require("../../application/useCases/ejecutarImportacionSunat");

const SUNAT_URL = "https://www.sunat.gob.pe/descargaPRR/padron_reducido_ruc.zip";
const DEST_DIR = path.resolve(__dirname, "../../../../../data/sunat");
const ZIP_FILE = path.join(DEST_DIR, "padron_reducido_ruc.zip");
const TXT_FILE = path.join(DEST_DIR, "padron_reducido_ruc.txt");

// 🔌 Conexión directa a la base de datos (para carga masiva)
async function connectDB() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "latin1_general_ci",
  });
}

async function downloadPadron() {
  if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

  console.log("📦 Descargando padrón reducido de SUNAT...");
  const writer = fs.createWriteStream(ZIP_FILE);
  const response = await axios({
    method: "GET",
    url: SUNAT_URL,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function extractTXT() {
  console.log("📂 Extrayendo archivo .txt...");
  const directory = await unzipper.Open.file(ZIP_FILE);
  const file = directory.files.find(f => f.path.endsWith(".txt"));
  if (!file) throw new Error("No se encontró el archivo .txt dentro del ZIP");

  await new Promise((resolve, reject) => {
    file.stream()
      .pipe(fs.createWriteStream(TXT_FILE))
      .on("finish", resolve)
      .on("error", reject);
  });

  return TXT_FILE;
}

async function loadPadronToDB(filePath) {
  const db = await connectDB();
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath).pipe(iconv.decodeStream("latin1")),
    crlfDelay: Infinity,
  });

  let counter = 0;
  let batch = [];

  for await (const line of rl) {
    const parts = line.split("|").map(part => part.trim());
    if (parts.length < 16) continue;

    const [
      ruc, nombre, estado, condicion, ubigeo, tipo_via, nombre_via,
      cod_zona, tipo_zona, numero, interior, lote,
      departamento, manzana, kilometro
    ] = parts;

    batch.push([
      ruc, nombre, estado, condicion, ubigeo, tipo_via, nombre_via,
      cod_zona, tipo_zona, numero, interior, lote,
      departamento, manzana, kilometro
    ]);

    counter++;

    if (batch.length >= 10000) {
      await insertBatch(db, batch);
      batch = [];
      console.log(`→ ${counter} líneas procesadas...`);
    }
  }

  if (batch.length > 0) await insertBatch(db, batch);

  rl.close();
  await db.end();
  console.log(`✅ Carga completa: ${counter} registros procesados.`);
}

async function insertBatch(db, batch) {
  return db.query(
    `INSERT INTO ContriSUNAT (
      ruc, nombre_razon_social, estado_contribuyente, condicion_domicilio,
      ubigeo, tipo_via, nombre_via, codigo_zona, tipo_zona, numero,
      interior, lote, departamento, manzana, kilometro
    ) VALUES ? 
    ON DUPLICATE KEY UPDATE 
      nombre_razon_social=VALUES(nombre_razon_social),
      estado_contribuyente=VALUES(estado_contribuyente),
      condicion_domicilio=VALUES(condicion_domicilio),
      ubigeo=VALUES(ubigeo),
      tipo_via=VALUES(tipo_via),
      nombre_via=VALUES(nombre_via),
      codigo_zona=VALUES(codigo_zona),
      tipo_zona=VALUES(tipo_zona),
      numero=VALUES(numero),
      interior=VALUES(interior),
      lote=VALUES(lote),
      departamento=VALUES(departamento),
      manzana=VALUES(manzana),
      kilometro=VALUES(kilometro)`,
    [batch]
  );
}

// 🕓 Cron automático: primer domingo del mes a las 03:00 AM
cron.schedule("0 3 1-7 * 0", () => {
  console.log("⏰ Ejecutando proceso automático SUNAT...");
  ejecutarImportacionSUNAT();
});

module.exports = {
  downloadPadron,
  extractTXT,
  loadPadronToDB,
};