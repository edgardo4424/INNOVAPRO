import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { choferInicialPrivado } from "../utils/valoresIncialGuia";
import { Search, Trash, UserRoundPlus } from "lucide-react";
import factilizaService from "../../../service/FactilizaService";
import { toast } from "react-toastify";

const ChoferPrivadoForm = () => {
  const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

  // Función unificada para manejar cambios en inputs y selects
  const handleChange = (value, name, index) => {
    setGuiaTransporte((prev) => ({
      ...prev,
      chofer: prev.chofer.map((chofer, i) =>
        i === index ? { ...chofer, [name]: value } : chofer,
      ),
    }));
  };

  // Función para agregar un nuevo chofer
  const addChofer = () => {
    setGuiaTransporte((prev) => ({
      ...prev,
      chofer: [...prev.chofer, choferInicialPrivado],
    }));
  };

  // Función para eliminar un chofer
  const removeChofer = (index) => {
    setGuiaTransporte((prev) => ({
      ...prev,
      chofer: prev.chofer.filter((_, i) => i !== index),
    }));
  };

  // Función para buscar información del chofer
  const handleBuscar = async (e, index) => {
    e.preventDefault();

    const chofer = guiaTransporte.chofer[index];

    if (!chofer.nro_doc) {
      toast.error("Por favor, ingresa el número de documento del chofer.");
      return;
    }

    try {
      const {
        data: data_inf,
        status: status_inf,
        success: suscces_inf,
      } = await factilizaService.metodoOpcional(
        chofer.tipo_doc,
        chofer.nro_doc,
      );
      let data_lic = {};
      let status_lic = 0;
      let suscces_lic = false;
      try {
        const res = await factilizaService.obtenerLicenciaPorDni(
          chofer.nro_doc,
        );
        data_lic = res.data;
        status_lic = res.status;
        suscces_lic = res.success;
      } catch (error) {
        toast.error(error.response.data.message);
      }

      if (status_inf == 200) {
        // ?? Asegúrate de que los nombres de las propiedades coincidan con la respuesta de tu API
        const nombres = data_inf.nombres || "";
        const apellidos =
          `${data_inf.apellido_paterno || ""} ${data_inf.apellido_materno || ""}`.trim();
        const licencia = data_lic.licencia?.numero || "";

        setGuiaTransporte((prev) => ({
          ...prev,
          chofer: prev.chofer.map((c, i) => {
            if (i === index) {
              return {
                ...c,
                nombres,
                apellidos,
                licencia,
              };
            }
            return c;
          }),
        }));
      } else {
        toast.error(
          data?.message ||
            "No se encontró información para el documento ingresado.",
        );
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
    }
  };

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <h1 className="mb-6 pb-2 text-left text-2xl font-semibold">
        Datos del Chofer
      </h1>
      {guiaTransporte.chofer.map((chofer, index) => (
        <div
          key={index}
          className="relative mb-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-md border border-gray-400 p-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Botón para eliminar chofer (visible si hay más de uno) */}
          {
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <button
                type="button"
                className="scale-105 cursor-pointer text-red-500 transition-all duration-300 hover:text-red-600"
                onClick={() => removeChofer(index)}
              >
                <Trash />
              </button>
            </div>
          }

          {/* Campo Tipo de Chofer */}
          <div>
            <Label
              htmlFor={`chofer-${index}-tipo`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Tipo
            </Label>
            <Select
              name="tipo"
              value={chofer.tipo}
              onValueChange={(value) => handleChange(value, "tipo", index)}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona un tipo de chofer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Principal">PRINCIPAL</SelectItem>
                <SelectItem value="Secundario">SECUNDARIO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo Tipo de Documento */}
          <div>
            <Label
              htmlFor={`chofer-${index}-tipo_doc`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Tipo Documento
            </Label>
            <Select
              name="tipo_doc"
              value={chofer.tipo_doc}
              onValueChange={(value) => handleChange(value, "tipo_doc", index)}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona un tipo de Documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  DNI - Documento Nacional de Identidad
                </SelectItem>
                <SelectItem value="4">CE - Carnet de extranjería</SelectItem>
                {/* Puedes añadir más tipos de documento aquí */}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Número de Documento y Botón de Búsqueda */}
          <div>
            <Label
              htmlFor={`chofer-${index}-nro_doc`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Número Documento
            </Label>
            <div className="flex gap-2">
              <Input
                type="text" // Cambiado a text para flexibilidad, puedes restringir con 'number' si solo son dígitos
                id={`chofer-${index}-nro_doc`}
                name="nro_doc"
                value={chofer.nro_doc}
                onChange={(e) =>
                  handleChange(e.target.value, e.target.name, index)
                }
                className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button" // Importante: usa type="button" para evitar que el botón envíe el formulario
                onClick={(e) => handleBuscar(e, index)}
                className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Campo Licencia */}
          <div>
            <Label
              htmlFor={`chofer-${index}-licencia`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Licencia
            </Label>
            <Input
              type="text"
              id={`chofer-${index}-licencia`}
              name="licencia"
              value={chofer.licencia}
              onChange={(e) =>
                handleChange(e.target.value, e.target.name, index)
              }
              className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Campo Nombres */}
          <div>
            <Label
              htmlFor={`chofer-${index}-nombres`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Nombres
            </Label>
            <Input
              type="text"
              id={`chofer-${index}-nombres`}
              name="nombres"
              value={chofer.nombres}
              onChange={(e) =>
                handleChange(e.target.value, e.target.name, index)
              }
              className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Campo Apellidos */}
          <div>
            <Label
              htmlFor={`chofer-${index}-apellidos`}
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              Apellidos
            </Label>
            <Input
              type="text"
              id={`chofer-${index}-apellidos`}
              name="apellidos"
              value={chofer.apellidos}
              onChange={(e) =>
                handleChange(e.target.value, e.target.name, index)
              }
              className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      ))}
      <div className="">
        <button
          type="button"
          onClick={addChofer}
          disabled={guiaTransporte.chofer.length !== 0}
          className={` ${guiaTransporte.chofer.length !== 0 ? "bg-gray-400" : "bg-innova-orange cursor-pointe"} r flex w-full items-center justify-center gap-x-2 rounded-md px-2 py-2 font-medium text-white md:w-auto`}
        >
          <UserRoundPlus className="size-6 md:size-6" />
          <span className="w-full text-center text-sm">Agregar Chofer</span>
        </button>
      </div>
    </div>
  );
};

export default ChoferPrivadoForm;
