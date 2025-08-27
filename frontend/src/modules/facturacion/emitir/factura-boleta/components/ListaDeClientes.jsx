import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import ClienteService from "@/modules/facturacion/service/ClienteService";
import { useEffect, useState } from "react";

const ListaDeCientes = ({ closeModal }) => {

    const {  setFactura } = useFacturaBoleta();

    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        const cargarPiezas = async () => {
            try {
                const data = await ClienteService.ObtenerClientes();
                setClientesDisponibles(data);
            } catch (error) {
                console.error('Error al cargar piezas', error);
            }
        };
        cargarPiezas();
    }, []);

    // * 🔍 Filtrar clientes
    const clientesFiltrados = clientesDisponibles.filter(c => {
        const campos = [
            c.dni?.toLowerCase(),
            c.ruc?.toLowerCase(),
            c.razon_social?.toLowerCase(),
            c.nombres?.toLowerCase(),
            c.apellidos?.toLowerCase(),
        ];
        return campos.some((campo) => campo?.includes(filtro.toLowerCase()));
    });

    const handleClick = (cliente) => {

        const { ruc, dni, razon_social, domicilio_fiscal } = cliente

        setFactura((prev) => ({
            ...prev,
            cliente_Tipo_Doc: ruc ? "6" : "1",
            cliente_Num_Doc: ruc ? ruc : dni,
            cliente_Razon_Social: razon_social,
            cliente_Direccion: domicilio_fiscal,
        }));

        closeModal();
    };


    return (
        <div >
            <div className="flex flex-col gap-1 col-span-1">
                <Label>Buscar por dni, ruc, razon social, nombres o apellidos</Label>
                <Input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Ej: AM.0100 o Husillo"
                    className="border-1 border-gray-400"
                />
            </div>

            {/* Scroll vertical aquí */}
            <div className="w-full overflow-x-auto mt-6">
                <div className="max-h-[300px] overflow-y-auto">
                    <Table className="border-2 border-gray-200">
                        <TableCaption className="text-gray-600 italic mt-2">
                            Lista de clientes
                        </TableCaption>

                        <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                            <TableRow>
                                <TableHead className="w-[120px]">Nro. Doc</TableHead>
                                <TableHead>Razon Social o Nombre</TableHead>
                                <TableHead>Direccion</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="bg-gray-200">
                            {clientesFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 text-gray-500 italic">
                                        ⚠️ No hay clientes que coincidan con la búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clientesFiltrados.map((item, index) => (
                                    <TableRow key={index}
                                        onClick={() => handleClick(item)}
                                        className={"cursor-pointer hover:bg-gray-300"}
                                    >
                                        <TableCell>{item.ruc ? item.ruc : item.dni || ""}</TableCell>
                                        <TableCell>{item.razon_social || ""}</TableCell>
                                        <TableCell>{item.domicilio_fiscal || ""}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ListaDeCientes;
