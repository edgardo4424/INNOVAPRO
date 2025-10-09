import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trabajadorSchema } from "../schema/trabajador.schema";
import trabajadoresService from "../services/trabajadoresService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockCargos, mockFiliales } from "../mocks/mockFiliales_Cargos";
import ContratosLaborales from "../components/ContratosLaborales";
import { toast } from "sonner";
import { default as SelectMultiple } from "react-select";

const dataInicial = {
  filial_id: "",
  nombres: "",
  apellidos: "",
  tipo_documento: "",
  numero_documento: "",
  telefono: "",
  fecha_nacimiento: "",
  asignacion_familiar: false,
  asignacion_familiar_fecha: null,
  domiciliado: true,
  sistema_pension: "",
  tipo_afp: null,
  cargo_id: "",
  comision_afp: false,
  cuspp_afp: "",
  estado_civil: "SOLTERO",
  contratos_laborales: [
    {
      id: Math.floor(Date.now() / 1000),
      fecha_inicio: "",
      fecha_fin: "",
      sueldo: "",
      regimen: "",
      tipo_contrato: "",
      banco: "",
      numero_cuenta: "",
      es_indefinido: false,
      id_cargo_sunat: ""
    },
  ],
};

export default function TrabajadorForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajador_id = searchParams.get("id");

  const isEditMode = useMemo(() => !!trabajador_id, [trabajador_id]);

  const [formData, setFormData] = useState(dataInicial);
  const [filiales, setFiliales] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valorUit, setValorUit] = useState(null);

  // estados para fetch de edición
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [filialesElegidas, setFilialesElegidas] = useState([]);

  // mock de filiales/cargos (reemplaza por tu fetch real si aplica)
  const fetchDataInicial = async () => {
    try {
      const res = await trabajadoresService.dataMantenimiento();
      const res_ = await trabajadoresService.getFiliales();

      setFiliales(res_.data);
      setValorUit(res.data.valor);
    } catch (error) {
      toast.error("No se pudo obtener la uit");
    }
  };
  useEffect(() => {
    setCargos(mockCargos);
    fetchDataInicial();
  }, []);

  // cargar trabajador si es edición
  useEffect(() => {
    let ignore = false;
    async function fetchTrabajador() {
      if (!isEditMode) return;
      setIsLoading(true);
      setFetchError("");
      try {
        const res =
          await trabajadoresService.obtenerTrabajadorPorId(trabajador_id);

        if (ignore) return;

        const t = res && res.data.trabajador ? res.data.trabajador : res || {};
        
        const contratos = Array.isArray(t.contratos_laborales)
          ? t.contratos_laborales.map((c, idx) => ({
              id: c?.id ?? idx + 1,
              fecha_inicio: c?.fecha_inicio ?? "",
              fecha_fin: c?.fecha_fin ?? "",
              banco: c?.banco ?? "",
              numero_cuenta: c?.numero_cuenta ?? "",
              sueldo: c?.sueldo ?? "",
              regimen: c?.regimen ?? "",
              tipo_contrato: c?.tipo_contrato ?? "",
              filial_id: c?.filial_id.toString() ?? "",
              es_indefinido: c?.es_indefinido ?? false,
              id_cargo_sunat: c?.id_cargo_sunat?.toString() ?? "",
              cargo_sunat_nombre: c?.cargo_sunat?.nombre || "",
            }))
          : dataInicial.contratos_laborales;

        setFormData({
          id: t.id,
          filial_id: (t.filial_id ?? "").toString(),
          nombres: t.nombres ?? "",
          apellidos: t.apellidos ?? "",
          tipo_documento: t.tipo_documento ?? "",
          numero_documento: t.numero_documento ?? "",
          telefono: t.telefono ?? "",
          fecha_nacimiento: t.fecha_nacimiento ?? "",
          asignacion_familiar: t.asignacion_familiar ? true : false, // checkbox
          asignacion_familiar_fecha: t.asignacion_familiar ?? null, // guardamos la fecha real
          domiciliado: !!t.domiciliado,
          sistema_pension: t.sistema_pension ?? "",
          tipo_afp: t.tipo_afp ?? null,
          comision_afp: !!t.comision_afp,
          cuspp_afp: t.cuspp_afp ?? "",
          estado_civil: t.estado_civil,
          cargo_id: (t.cargo_id ?? "").toString(),
          contratos_laborales: contratos.length
            ? contratos
            : dataInicial.contratos_laborales,
        });
      } catch (e) {
        console.error(e);
        setFetchError(
          (e && e.message) ||
            "No se pudo cargar la información del trabajador.",
        );
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchTrabajador();
    return () => {
      ignore = true;
    };
  }, [isEditMode, trabajador_id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const buildPayload = () => {
    const ultimoContrato = formData.contratos_laborales.at(-1);
    return {
      filial_id:
        formData.cargo_id == 1 || formData.cargo_id == 14
          ? null
          : formData.filial_id,
      filiales_asignadas:
        formData.cargo_id == 1 || formData.cargo_id == 14
          ? filialesElegidas
          : null,
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      tipo_documento: formData.tipo_documento,
      numero_documento: formData.numero_documento.trim(),
      telefono: formData.telefono.trim(),
      fecha_nacimiento: formData.fecha_nacimiento,
      asignacion_familiar: formData.asignacion_familiar,
      asignacion_familiar_fecha: formData.asignacion_familiar_fecha,

      domiciliado: formData.domiciliado,
      sistema_pension: formData.sistema_pension,
      tipo_afp: formData.tipo_afp,
      comision_afp: formData.comision_afp,
      cargo_id: formData.cargo_id,
      contratos_laborales: formData.contratos_laborales,
      sueldo_base: ultimoContrato ? ultimoContrato.sueldo : "",
      cuspp_afp: formData.cuspp_afp.trim(),
      estado_civil: formData.estado_civil,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valorUit) return;

    try {
      setIsSubmitting(true);

      const dataToSubmit = buildPayload();

      if (isEditMode) {
        dataToSubmit.id = trabajador_id;

        await trabajadorSchema(isEditMode).validate(dataToSubmit, {
          abortEarly: false,
        });

        const dataBodyEditar = {
          ...dataToSubmit,
          asignacion_familiar: dataToSubmit?.asignacion_familiar
            ? dataToSubmit?.asignacion_familiar_fecha
            : null,
        };
        console.log('dataBodyEditar', dataBodyEditar);
        const response =
         await trabajadoresService.editarTrabajador(dataBodyEditar);
        toast.success("Trabajador actualizado con éxito");
      } else {
        await trabajadorSchema(isEditMode).validate(dataToSubmit, {
          abortEarly: false,
        });

        const dataBodyCrear = {
          ...dataToSubmit,
          asignacion_familiar: dataToSubmit.asignacion_familiar
            ? dataToSubmit?.asignacion_familiar_fecha
            : null,
        };

        console.log("dataBodyCrear", dataBodyCrear);
        await trabajadoresService.crearTrabajador(dataBodyCrear);
        toast.success("Trabajador creado con éxito");
      }
      navigate("/tabla-trabajadores");
    } catch (error) {
      if (error && error.name === "ValidationError") {
        const newErrors =
          error.inner?.reduce((acc, curr) => {
            acc[curr.path] = curr.message;
            return acc;
          }, {}) || {};
        setErrors(newErrors);
      } else {
        console.error("El error encontrado es: ", error);
        if (error?.response?.data?.mensaje) {
          if (typeof error?.response?.data?.mensaje == "string") {
            toast.error(error?.response?.data?.mensaje);
          } else {
            for (const e of error.response.data.mensaje) {
              toast.error(e);
            }
          }

          return;
        }
        toast.error(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            (isEditMode
              ? "Error al actualizar el trabajador"
              : "Error al crear el trabajador"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[52rem] p-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1b274a]">
            <User className="h-7 w-7" />
            <span className="text-3xl">
              {isEditMode ? "Editar Trabajador" : "Registro de Trabajador"}
            </span>
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Actualice los datos del trabajador. Los campos marcados con * son obligatorios."
              : "Complete los datos del nuevo trabajador. Los campos marcados con * son obligatorios."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Estado de carga */}
          {isLoading && (
            <Alert>
              <AlertDescription>Cargando información...</AlertDescription>
            </Alert>
          )}

          {/* Error al cargar */}
          {!isLoading && fetchError && (
            <Alert>
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}

          {/* Formulario */}
          {!isLoading && !fetchError && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de la Empresa */}

              {/* Información Personal */}
              <article className="space-y-4">
                <section className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-[#1b274a]" />
                  Información Personal
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres *</Label>
                    <Input
                      id="nombres"
                      value={formData.nombres}
                      onChange={(e) =>
                        handleInputChange("nombres", e.target.value)
                      }
                      placeholder="Ingrese los nombres"
                    />
                    {errors.nombres && (
                      <p className="text-sm text-red-500">{errors.nombres}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) =>
                        handleInputChange("apellidos", e.target.value)
                      }
                      placeholder="Ingrese los apellidos"
                    />
                    {errors.apellidos && (
                      <p className="text-sm text-red-500">{errors.apellidos}</p>
                    )}
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                    <Select
                      value={formData.tipo_documento}
                      onValueChange={(value) =>
                        handleInputChange("tipo_documento", value)
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Seleccione tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="CE">Carné de Extranjería</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipo_documento && (
                      <p className="text-sm text-red-500">
                        {errors.tipo_documento}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero_documento">
                      Número de Documento *
                    </Label>
                    <Input
                      id="numero_documento"
                      value={formData.numero_documento}
                      onChange={(e) =>
                        handleInputChange("numero_documento", e.target.value)
                      }
                      placeholder="Ingrese el número de documento"
                    />
                    {errors.numero_documento && (
                      <p className="text-sm text-red-500">
                        {errors.numero_documento}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) =>
                        handleInputChange("telefono", e.target.value)
                      }
                      placeholder="Ingrese el número de teléfono"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-red-500">{errors.telefono}</p>
                    )}
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="telefono">Estado Civil</Label>
                     <Select
                      value={formData.estado_civil}
                      onValueChange={(value) =>
                        handleInputChange("estado_civil", value)
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Seleccione estado civil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLTERO">Soltero</SelectItem>
                        <SelectItem value="CASADO">Casado</SelectItem>
                        <SelectItem value="DIVORCIADO">Divorciado</SelectItem>
                        <SelectItem value="VIUDO">Viudo</SelectItem>
                        <SelectItem value="CONVIVIENTE">Conviviente</SelectItem>

                      </SelectContent>
                    </Select>
                    {errors.estado_civil && (
                      <p className="text-sm text-red-500">
                        {errors.estado_civil}
                      </p>
                    )}
                  </div>
                </section>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_nacimiento">
                      Fecha de nacimiento *
                    </Label>
                    <Input
                      id="fecha_nacimiento"
                      type={"date"}
                      value={formData.fecha_nacimiento}
                      onChange={(e) =>
                        handleInputChange("fecha_nacimiento", e.target.value)
                      }
                      placeholder="Ingresa la fecha de nac."
                    />
                    {errors.fecha_nacimiento && (
                      <p className="text-sm text-red-500">
                        {errors.fecha_nacimiento}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo_id">Cargo *</Label>
                    <Select
                      value={formData.cargo_id}
                      onValueChange={(value) =>
                        handleInputChange("cargo_id", value)
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Seleccione un cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem
                            key={cargo.id}
                            value={cargo.id.toString()}
                          >
                            {cargo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cargo_id && (
                      <p className="text-sm text-red-500">{errors.cargo_id}</p>
                    )}
                  </div>
                </section>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2 pl-4">
                    <Checkbox
                      id="domiciliado"
                      checked={formData.domiciliado}
                      className="border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80 data-[state=checked]:bg-[#1b274a]"
                      onCheckedChange={(checked) =>
                        handleInputChange("domiciliado", !!checked)
                      }
                    />
                    <Label htmlFor="domiciliado">Domiciliado</Label>
                  </div>
                </section>
              </article>

              <ContratosLaborales
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                filiales={filiales}
                isEditMode={isEditMode}
              />

              {/* Beneficios y Sistema de Pensión */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Shield className="h-5 w-5 text-[#1b274a]" />
                  Beneficios y Sistema de Pensión
                </div>

                <div className="grid w-full grid-cols-1 space-y-4 md:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id="asignacion_familiar"
                      checked={formData.asignacion_familiar}
                      className="border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80 data-[state=checked]:bg-[#1b274a]"
                      onCheckedChange={(checked) => {
                        //handleInputChange("asignacion_familiar", !!checked);
                  
                        handleInputChange("asignacion_familiar", !!checked);
                        if (!checked) {
                        
                          handleInputChange("asignacion_familiar_fecha", "");
                        }
                        /* handleInputChange(
                          "asignacion_familiar_fecha",
                          checked
                            ? new Date().toISOString().split("T")[0]
                            : null,
                        ); */
                      }}
                    />

                    <Label htmlFor="asignacion_familiar">
                      Asignacion Familiar
                    </Label>

                    {formData.asignacion_familiar && (
                      <div className="">
                        <Input
                          id="asignacion_familiar_fecha"
                          type={"date"}
                          value={formData.asignacion_familiar_fecha}
                          onChange={(e) => {
                          
                            handleInputChange(
                              "asignacion_familiar_fecha",
                              e.target.value,
                            );
                          }}
                          placeholder="Ingresa la fecha de asignación familiar"
                        />
                        {errors.asignacion_familiar_fecha && (
                          <p className="text-sm text-red-500">
                            {errors.asignacion_familiar_fecha}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sistema_pension">
                      Sistema de Pensión *
                    </Label>
                    <Select
                      value={formData.sistema_pension}
                      onValueChange={(value) => {
                        handleInputChange("sistema_pension", value);
                        setFormData((prev) => ({
                          ...prev,
                          tipo_afp: null,
                        }));
                      }}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Seleccione sistema de pensión" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AFP">AFP</SelectItem>
                        <SelectItem value="ONP">ONP</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sistema_pension && (
                      <p className="text-sm text-red-500">
                        {errors.sistema_pension}
                      </p>
                    )}
                  </div>

                  {formData.sistema_pension === "AFP" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="tipo_afp">Tipo de AFP *</Label>
                        <Select
                          value={formData.tipo_afp || ""}
                          onValueChange={(value) =>
                            handleInputChange("tipo_afp", value)
                          }
                        >
                          <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder="Seleccione el tipo de AFP" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HABITAT">HABITAT</SelectItem>
                            <SelectItem value="INTEGRA">INTEGRA</SelectItem>
                            <SelectItem value="PRIMA">PRIMA</SelectItem>
                            <SelectItem value="PROFUTURO">PROFUTURO</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.tipo_afp && (
                          <p className="text-sm text-red-500">
                            {errors.tipo_afp}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pl-4">
                        <Checkbox
                          id="comision_afp"
                          checked={formData.comision_afp}
                          className="border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80 data-[state=checked]:bg-[#1b274a]"
                          onCheckedChange={(checked) =>
                            handleInputChange("comision_afp", !!checked)
                          }
                        />
                        <Label htmlFor="comision_afp">
                          ¿Aplica comisión AFP?
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo_afp">CUSPP AFP</Label>

                        <Input
                          id="cuspp_afp"
                          value={formData.cuspp_afp}
                          onChange={(e) =>
                            handleInputChange("cuspp_afp", e.target.value)
                          }
                          placeholder="Ingrese el CUSPP"
                        />

                         {errors.cuspp_afp && (
                          <p className="text-sm text-red-500">
                            {errors.cuspp_afp}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => navigate("/tabla-trabajadores")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    "bg-innova-blue hover:bg-innova-blue/90 cursor-pointer"
                  }
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Guardando..."
                      : "Registrando..."
                    : isEditMode
                      ? "Guardar cambios"
                      : "Registrar Trabajador"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
