import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import choferService from "@/modules/transporte/service/ChoferService";
import vehiculoService from "@/modules/transporte/service/VehiculosService";
import { Search } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChoferForm = ({ closeModal, refresh, Form, setForm }) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [listaVehiculos, setListaVehiculos] = useState([]);

  const handleChange = (e) => {
    if (e.target.name === "nro_doc") {
      const valor = e.target.value.replace(/[^0-9]/g, "");
      setForm({ ...Form, nro_doc: valor });
    } else {
      setForm({ ...Form, [e.target.name]: e.target.value.toUpperCase() });
    }
  };

  const handleVehiculo = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };

  const handleLicencia = async () => {
    // * 3. Si el documento es DNI (tipo_doc = "1"), intentamos obtener licencia
    if (Form.tipo_doc === "1") {
      try {
        const {
          data: data_lic,
          status: status_lic,
          success: success_lic,
        } = await toast.promise(
          factilizaService.obtenerLicenciaPorDni(Form.nro_doc),
          {
            pending: "Buscando licencia del chofer",
            success: "Licencia encontrada",
          },
        );

        return data_lic?.licencia?.numero || "";
      } catch (error) {
        toast.warning(
          error.response?.data?.message ||
            "No se pudo obtener la licencia del chofer.",
        );
        return "";
      }
    } else {
      return "";
    }
  };
  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!Form.nro_doc) {
      toast.error("Por favor, ingresa el número de documento del chofer.");
      return;
    }
    setLoadingSearch(true);
    try {
      //* 1. Consultar datos generales
      const {
        data: data_inf,
        status: status_inf,
        success: success_inf,
      } = await toast.promise(
        factilizaService.metodoOpcional(Form.tipo_doc, Form.nro_doc),
        {
          pending: "Buscando información del chofer",
          success: "Información encontrada",
          error: "Ocurrió un error al buscar la información del chofer",
        },
      );

      if (status_inf !== 200 || !success_inf) {
        toast.error(
          data_inf?.message ||
            "No se encontró información para el documento ingresado.",
        );
        return;
      }

      //* 2. Armar nombres y apellidos desde la respuesta
      const nombres = data_inf.nombres || "";
      const apellidos = `${data_inf.apellido_paterno || ""} ${
        data_inf.apellido_materno || ""
      }`.trim();

      let licencia = await handleLicencia();

      // Actualizar con datos básicos
      setForm((prevForm) => ({
        ...prevForm,
        nombres,
        apellidos,
        nro_licencia: licencia,
      }));
    } catch (error) {
      // toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
    } finally {
      setLoadingSearch(false);
    }
  };
  // 75756407
  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoadingSave(true);

    try {
      // ? Validación de campos obligatorios
      if (!Form.tipo_doc) {
        toast.error("Debes seleccionar el tipo de documento.");
        setLoadingSave(false);
        return;
      }
      if (!Form.nro_doc || Form.nro_doc.trim() === "") {
        toast.error("El número de documento es obligatorio.");
        setLoadingSave(false);
        return;
      }
      if (Form.tipo_doc === "1" && Form.nro_doc.length !== 8) {
        toast.error("El DNI debe tener 8 dígitos.");
        setLoadingSave(false);
        return;
      }
      if (!Form.nombres || Form.nombres.trim() === "") {
        toast.error("El nombre es obligatorio.");
        setLoadingSave(false);
        return;
      }
      if (!Form.apellidos || Form.apellidos.trim() === "") {
        toast.error("Los apellidos son obligatorios.");
        setLoadingSave(false);
        return;
      }

      const { message, data, success } = await toast.promise(
        choferService.crear(Form),
        {
          pending: "Guardando chofer...",
          success: "Chofer Guardado exitosamente",
        },
      );

      if (success && success) {
        refresh();
        closeModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Ocurrio un error.");
    } finally {
      setLoadingSave(false);
    }
  };

  const buscarVehiculos = useCallback(async () => {
    try {
      const { data, success, message } = await vehiculoService.listar();
      if (success) {
        setListaVehiculos(
          data.filter((v) => v.id_chofer === null || v.id_chofer === Form.id),
        );
      }
    } catch (error) {
      toast.error("Error al cargar vehículos");
    }
  }, []);

  useEffect(() => {
    buscarVehiculos();
  }, []);

  return (
    <div>
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        {/* Tipo Documento */}
        <div className="space-y-2">
          <Label htmlFor="tipo_doc">Tipo Documento</Label>
          <Select
            required
            id="tipo_doc"
            name="tipo_doc"
            value={Form.tipo_doc}
            onValueChange={(value) =>
              handleChange({ target: { name: "tipo_doc", value } })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">DNI</SelectItem>
              <SelectItem value="4">Carnet de Extranjería (CE)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nro. Documento */}
        <div className="space-y-2">
          <Label htmlFor="nro_doc">Nro. Documento</Label>
          <div className="flex gap-x-2">
            <Input
              id="nro_doc"
              name="nro_doc"
              placeholder="Ej: 28293031"
              type="text"
              value={Form.nro_doc}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={handleBuscar}
              disabled={loadingSearch}
              title="Buscar"
              aria-label="Buscar"
              className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nombres */}
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres</Label>
          <Input
            id="nombres"
            name="nombres"
            placeholder="Ej: LEONEL"
            value={Form.nombres}
            onChange={handleChange}
            required
          />
        </div>

        {/* Apellidos */}
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            name="apellidos"
            placeholder="Ej: CUCCITINI"
            value={Form.apellidos}
            onChange={handleChange}
            required
          />
        </div>

        {/* Licencia */}
        <div className="space-y-2">
          <Label htmlFor="nro_licencia">Nro. Licencia</Label>
          <Input
            id="nro_licencia"
            name="nro_licencia"
            placeholder="Ej: L-22334455"
            value={Form.nro_licencia}
            onChange={handleChange}
          />
        </div>

        {/* Vehiculo */}
        <div className="space-y-2">
          <Label htmlFor="id_vehiculo">Vehiculo</Label>
          <Select
            required
            id="id_vehiculo"
            name="id_vehiculo"
            value={Form.id_vehiculo?.toString() || ""}
            onValueChange={(value) =>
              handleVehiculo({ target: { name: "id_vehiculo", value } })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              {listaVehiculos.map((v) => (
                <SelectItem key={v.id} value={v.id.toString()}>
                  {v.nro_placa} - {v?.transportista?.razon_Social || ""}
                </SelectItem>
              ))}
              <SelectItem value={null}>Ninguno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          className={
            "bg-innova-orange hover:bg-innova-orange cursor-pointer transition-all hover:scale-105"
          }
          disabled={loadingSave}
          onClick={handleGuardar}
        >
          {loadingSave ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
};

export default ChoferForm;
