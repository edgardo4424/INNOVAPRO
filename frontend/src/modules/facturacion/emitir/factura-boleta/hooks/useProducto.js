import productoService from "../../../service/ProductoService";

const useProducto = () => {
    const ObtenerProductos = async () => {
        const response = await productoService.ObtenerPiezas();
        return response;
    };

    return {
        ObtenerProductos,
    };
};

export default useProducto;
