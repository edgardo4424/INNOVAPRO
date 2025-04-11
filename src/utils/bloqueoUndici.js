const bloquearUndiciYFetch = () => {
    if (process.env.DISABLE_UNDICI !== "true") return;

  // 🔒 Variables de entorno para desactivar funcionalidades
  process.env.UNDIICI_NO_WASM = "1";
  process.env.UNDICI_DISABLE_GLOBAL = "true";
  process.env.WASM_DISABLE = "1";
  process.env.NODE_NO_WARNINGS = "1";
  process.env.NODE_OPTIONS = "--no-experimental-fetch";

  // 🔥 Eliminar funcionalidades del entorno global
  global.WebAssembly = undefined;
  global.fetch = undefined;

  // 🔒 Reescribir require para bloquear ciertos módulos
  const Module = require("module");
  const originalRequire = Module.prototype.require;
  Module.prototype.require = function (path) {
    if (path.includes("undici") || path.includes("fetch") || path.includes("llhttpWasmData")) {
      throw new Error("🚫 Bloqueo forzado: 'undici' y 'fetch' han sido eliminados.");
    }
    return originalRequire.apply(this, arguments);
  };
}

module.exports = { bloquearUndiciYFetch };