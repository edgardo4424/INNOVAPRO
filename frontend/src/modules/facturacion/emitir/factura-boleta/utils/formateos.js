
const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const getTipoDocLabel = (code) => {
    switch (code) {
        case "07":
            return "NOTA DE CRÉDITO";
        case "08":
            return "NOTA DE DÉBITO";
        default:
            return "NOTA ELECTRÓNICA";
    }
};

const getTipoDocCliente = (code) => {
    switch (String(code)) {
        case "6":
            return "RUC";
        case "1":
            return "DNI";
        case "4":
            return "CARNET DE EXTRANJERÍA";
        default:
            return "OTRO";
    }
};

export {
    formatDateTime,
    getTipoDocLabel,
    getTipoDocCliente
};