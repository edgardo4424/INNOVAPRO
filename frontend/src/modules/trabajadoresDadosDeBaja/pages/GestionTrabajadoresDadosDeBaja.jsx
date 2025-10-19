import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  PlusCircle,
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
  Power,
  RefreshCw,
  Filter,
  FileText,
} from "lucide-react";
//import beneficiosService from "../services/beneficiosService";
//import { formatoDinero } from "../utils/formatoDinero";
//import { formatoFechaBeneficios } from "../utils/formatoFechaBeneficios";
import { toast } from "sonner";
import trabajadoresDadosDeBajaService from "../services/trabajadoresDadosDeBaja";
import { formatearFecha } from "@/modules/gratificacion/utils/formatearFecha";
import TrabajadorCombobox from "@/modules/retenciones/components/TrabajadorCombobox";
import SelectorConBuscador from "@/components/SelectorConBuscador";
import { trabajadoresDadosDeBajaSchema } from "../schema/trabajadores_dados_de_baja.schema";

const GestionTrabajadoresDadosDeBaja = () => {
  const [loading, setLoading] = useState(true);
  const [filiales, setFiliales] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [motivosLiquidacion, setMotivosLiquidacion] = useState([])
  const [trabajadorElegido, setTrabajadorElegido] = useState(null);

  const [trabajadoresDadosDeBaja, setTrabajadoresDadosDeBaja] = useState([]);

  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("crear"); // "crear" | "editar" | "ver"

  // Estado para seleccionar motivo
  const [selectorIdMotivo, setSelectorIdMotivo] = useState(null);

  const [errores, setErrores] = useState({});


  const [form, setForm] = useState({
    filial_id: "",
    trabajador_id: "",
    fecha_baja: "",
    motivo_liquidacion_id: "",
    observacion: "",
  });

  const fetchFiliales = async () => {
    try {
      const res = await trabajadoresDadosDeBajaService.getFiliales();

      const filialesMapeados = res?.data?.map((f) => ({
        value: f.id,
        label: f.razon_social,
      }));
      setFiliales(filialesMapeados);
    } catch (e) {
      console.error(e?.message ?? "No se pudo cargar la lista de filiales");
    } finally {
    }
  };

  const obtenerTrabajadores = async (filial_id) => {
    try {
      const res =
        await trabajadoresDadosDeBajaService.getTrabajadoresConContratosVigentes(
          { filial_id }
        );

      setTrabajadores(res.data.trabajadores);
    } catch (e) {
      console.error(e?.message ?? "No se pudo cargar la lista de trabajadores");
    } finally {
    }
  };

  const obtenerMotivosLiquidacion = async () => {
    try {
      const res =
        await trabajadoresDadosDeBajaService.getMotivosLiquidacion();

      setMotivosLiquidacion(res.data);
    } catch (e) {
      console.error(e?.message ?? "No se pudo cargar la lista de trabajadores");
    } finally {
    }
  };

  const fetchTrabajadoresDadosDeBaja = async () => {
    try {
      setLoading(true);
      const res =
        await trabajadoresDadosDeBajaService.getTrabajadoresDadosDeBaja();
      setTrabajadoresDadosDeBaja(res.data);
    } catch (e) {
      console.error(e?.message ?? "No se pudo cargar la lista de trabajadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajadoresDadosDeBaja();
  }, []);

  const openCreate = () => {
    setErrores({});
    setViewMode("crear");
    Promise.all([
      fetchFiliales(),
      obtenerTrabajadores(form?.filial_id || ""),
      obtenerMotivosLiquidacion()
    ]).finally(() => {
      setLoading(false);
    });

    setForm({
      filial_id: "",
      trabajador_id: "",
      fecha_baja: "",
      motivo_liquidacion_id: "",
      observacion: "",
    });
    setTrabajadorElegido(null);
    setSelectorIdMotivo("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrorMsg(null);

      // Validar con yup
      const datosValidados = await trabajadoresDadosDeBajaSchema.validate(
        form,
        { abortEarly: false }
      );
      setErrores({});

      if (viewMode === "crear") {
        await trabajadoresDadosDeBajaService.darDeBajaTrabajador(datosValidados);
        toast.success("Trabajador dado de baja correctamente");
        await fetchTrabajadoresDadosDeBaja();
      }
      setDialogOpen(false);
    } catch (e) {

      // 🔹 Errores de Yup
    if (e.name === "ValidationError") {
      const newErrors = {};
      e.inner.forEach(err => {
        newErrors[err.path] = err.message;
        //toast.error(err.message); // mostrar en toast cada error
      });
      setErrores(newErrors);
      return;
    }
      toast.error(
        "No se pudo dar de baja al trabajador"
      );
    }
  };

  const onTrabSelect = (val) => {
    const trabajadorElegido = trabajadores.find((t) => t.id === val);

    setTrabajadorElegido(trabajadorElegido);
    setForm((prevForm) => ({
      ...prevForm,
      trabajador_id: val,
      contrato_id: trabajadorElegido?.ultimo_contrato?.id,
    }));
  };

 const handleDownload = async (id, dni, nombre_completo_trabajador) => {
  try {
    const response = await trabajadoresDadosDeBajaService.reporteLiquidacion(id);

    let blob;
    if (response.data instanceof Blob) {
      // 👌 Ya viene como Blob
      blob = response.data;
    } else {
      // 🚨 Viene como texto/base64 → conviértelo a Blob
      blob = new Blob([response.data], { type: "application/pdf" });
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LBS - ${dni} - ${nombre_completo_trabajador}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Liquidación descargada exitosamente");
  } catch (err) {
    console.error("Error en handleDownload", err);
    toast.error("Error al tratar de descargar la liquidación del trabajador");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Trabajadores dados de Baja
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={openCreate}
              className="bg-innova-blue hover:bg-innova-blue/90"
            >
              Dar de Baja <PlusCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nombre, apellido, DNI u observación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Alertas simples */}
        {(errorMsg || infoMsg) && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              errorMsg
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="flex items-start justify-between">
              <p>{errorMsg || infoMsg}</p>
              <button
                onClick={() =>
                  errorMsg ? setErrorMsg(null) : setInfoMsg(null)
                }
                className="ml-4 text-xs underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium text-center">DNI</th>
                  <th className="px-4 py-3 font-medium text-center">Trabajador</th>
                  <th className="px-4 py-3 font-medium text-center">Fecha de Ingreso</th>
                  <th className="px-4 py-3 font-medium text-center">Fecha de Baja</th>
                  <th className="px-4 py-3 font-medium text-center">Motivo</th>
                  <th className="px-4 py-3 font-medium text-center">Estado liquidación</th>
                  <th className="px-4 py-3 font-medium text-center">Neto a Liquidar</th>
                  <th className="px-4 py-3 font-medium text-center">Liquidación</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500"
                      colSpan={7}
                    >
                      Cargando...
                    </td>
                  </tr>
                )}

                {!loading &&
                  trabajadoresDadosDeBaja.map((t) => {
                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          {t.trabajador.numero_documento ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          {`${t.trabajador.nombres ?? ""} ${
                            t.trabajador.apellidos ?? ""
                          }`.trim() || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {formatearFecha(t.fecha_ingreso_real)}
                        </td>
                        <td className="px-4 py-3">
                          {formatearFecha(t.fecha_baja)}
                        </td>
                        <td className="px-4 py-3 max-w-[300px]">{/* <p className="truncate"> */}{t.motivo_liquidacion.descripcion_corta}{/* </p> */}</td>
                        <td className="px-4 py-3 ">{t.estado_liquidacion}</td>
                        <td className="px-4 py-3 ">{t.total_liquidacion}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col justify-center items-center">
 <button
                                onClick={() => handleDownload(t.id, t.trabajador.numero_documento, `${t.trabajador.nombres ?? ""} ${
                            t.trabajador.apellidos ?? ""
                          }`.trim())}
                                className="cursor-pointer flex items-center justify-center gap-2 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors"
                            >
                                <FileText size={20} />
                            </button>
                          </div>
                         
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dialogo Crear / Editar / Ver */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {viewMode === "crear" && "Dar de baja a un Trabajador"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {viewMode === "ver"
                  ? "Consulta la información del Trabajador"
                  : "Ingresa los datos correctamente."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2">
              {/* Filiales */}
              <div className="grid gap-1">
                <Label>Filial</Label>
                <Select
                  value={form.filial_id}
                  onValueChange={async (val) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      filial_id: val,
                    }));
                    await obtenerTrabajadores(val);
                  }}
                  disabled={viewMode === "ver" || viewMode === "editar"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una filial" />
                  </SelectTrigger>
                  <SelectContent>
                    {filiales.map((f, i) => (
                      <SelectItem key={i} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             {errores.filial_id && (
                     <p className="error-message">{errores.filial_id}</p>
                  )}
              </div>

              {/* Trabajador */}
              <div className="grid gap-1">
                <Label>Trabajador</Label>
                

                <TrabajadorCombobox
                  trabajadores={trabajadores}
                  value={form.trabajador_id || ""}
                  onSelect={onTrabSelect}
                  //dense
                />
              {errores.trabajador_id && (
                      <p className="error-message">{errores.trabajador_id}</p>
                   )}
              </div>

              {/* Contrato */}
              <div className="grid gap-1">
                <Label>Último contrato</Label>

                <div className="text-sm flex justify-center gap-16">
                  <div className="">
                    <div>Fecha inicio</div>
                    <div>
                      {formatearFecha(
                        trabajadorElegido?.ultimo_contrato?.fecha_inicio
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div>Fecha fin</div>
                    <div>
                      {formatearFecha(
                        trabajadorElegido?.ultimo_contrato?.fecha_fin
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div className="grid gap-1">
                <Label>Fecha de Baja</Label>
                <Input
                  type="date"
                  value={form.fecha_baja}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fecha_baja: e.target.value }))
                  }
                  disabled={viewMode === "ver"}
                />
              {errores.fecha_baja && (
                      <p className="error-message">{errores.fecha_baja}</p>
                   )}
              </div>

              <div className="grid gap-1">
                <Label>Motivo</Label>
                
                <SelectorConBuscador
                  listado={motivosLiquidacion}
                  value={selectorIdMotivo}
                  onSelect={(id) => {
                    setSelectorIdMotivo(id)
                    setForm((prevForm) => ({
                      ...prevForm,
                      motivo_liquidacion_id: id,
                    }));
                    }}
                  labelFn={(m) => `${m.descripcion_corta}`} // si quieres mostrar más info
                  /* idField="codigo"  // si en lugar de id usas "codigo" */
                  placeholder="Selecciona un motivo"
                />

              {errores.motivo_liquidacion_id && (
                      <p className="error-message">{errores.motivo_liquidacion_id}</p>
                   )}

              </div>

              {/* Observación */}
              <div className="grid gap-1">
                <Label>Observación</Label>
                <Textarea
                  placeholder="Observación..."
                  value={form.observacion}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      observacion: e.target.value,
                    }))
                  }
                  disabled={viewMode === "ver"}
                />
              </div>
            </div>

            <AlertDialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cerrar
              </Button>
              {viewMode !== "ver" && (
                <Button
                  onClick={handleSave}
                  className="bg-innova-blue hover:bg-innova-blue/90"
                >
                  {viewMode === "crear" ? "Crear" : "Guardar cambios"}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default GestionTrabajadoresDadosDeBaja;
