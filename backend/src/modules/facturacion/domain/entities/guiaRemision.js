class GuiaRemision {
    constructor({
    }) {

    }

    static crear(props) {
        return {
            success: true,
            message: "Guía válida",
            data: new GuiaRemision(props),
        };
    }
}

module.exports = GuiaRemision;


