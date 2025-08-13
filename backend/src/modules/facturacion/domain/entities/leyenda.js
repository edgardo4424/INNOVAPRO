class Leyenda {
    constructor({ factura_id, legend_code, legend_value }) {
        this.factura_id = factura_id;
        this.legend_code = legend_code;
        this.legend_value = legend_value;
    }

    static crear(props) {
        // const requiredFields = ["factura_id", "legend_code", "legend_value"];

        // for (const field of requiredFields) {
        //     if (
        //         props[field] === undefined ||
        //         props[field] === null ||
        //         (typeof props[field] === "string" && props[field].trim() === "")
        //     ) {
        //         return {
        //             success: false,
        //             message: `The field '${field}' is required to create the legend.`,
        //             leyenda: null,
        //         };
        //     }
        // }

        // if (
        //     typeof props.factura_id !== "number" ||
        //     !Number.isInteger(props.factura_id) ||
        //     props.factura_id <= 0
        // ) {
        //     return {
        //         success: false,
        //         message: "The 'factura_id' must be a positive integer.",
        //         leyenda: null,
        //     };
        // }

        return {
            success: true,
            message: "Legend created successfully.",
            leyenda: new Leyenda(props),
        };
    }

    static editar(props) {
        if (!props.id) {
            return {
                success: false,
                message: "The 'id' is required to edit the legend.",
                leyenda: null,
            };
        }

        if (
            props.factura_id !== undefined &&
            (typeof props.factura_id !== "number" ||
                !Number.isInteger(props.factura_id) ||
                props.factura_id <= 0)
        ) {
            return {
                success: false,
                message: "If provided, 'factura_id' must be a positive integer.",
                leyenda: null,
            };
        }

        return {
            success: true,
            message: "Legend fields are valid for editing.",
            leyenda: new Leyenda(props),
        };
    }
}

module.exports = Leyenda;
