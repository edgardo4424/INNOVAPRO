const bgFilial = (filial) => {
    switch (filial) {
        case "20562974998":
            //?  "ENCOFRADOS INNOVA S.A.C.",
            return "bg-blue-100";
        case "20610202358":
            // ?? "INNOVA GREEN ENERGY S.A.C.",
            return "bg-green-100";
        case "20555389052":
            // ?? "INDEK ANDINA E.I.R.L",
            return "bg-emerald-100";
        case "20603021933":
            // ?? "INNOVA RENTAL MAQUINARIA S.A.C.",
            return "bg-orange-100";
        case "20602696643":
            // ?? "ANDAMIOS ELECTRICOS INNOVA S.A.C.",
            return "bg-purple-100";
        default:
            return "bg-gray-100";
    }
};

export default bgFilial;