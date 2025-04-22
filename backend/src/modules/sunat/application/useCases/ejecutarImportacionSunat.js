const {
    downloadPadron,
    extractTXT,
    loadPadronToDB,
} = require("../../infrastructure/services/padronProcessor");

module.exports = async function ejecutarImportacionSUNAT() {
    try {
        await downloadPadron();
        const filePath = await extractTXT();
        await loadPadronToDB(filePath);
        console.log("🎉 Proceso SUNAT completado con éxito.");
    } catch (error) {
        console.error("❌ Error en el proceso:", error.message);
        throw error;
    }
}