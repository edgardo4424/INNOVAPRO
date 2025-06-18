import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
//import Select from "react-select";
import { obraSchema } from "../schema/obra.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const mapContainerStyle = {
  width: "100%",
  height: "400px",
  marginTop: "10px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: -12.0464,
  lng: -77.0428,
};

const estadosObra = [
  { value: "Planificación", label: "Planificación" },
  { value: "Demolición", label: "Demolición" },
  { value: "Excavación", label: "Excavación" },
  { value: "Cimentación y estructura", label: "Cimentación y estructura" },
  { value: "Cerramientos y albañilería", label: "Cerramientos y albañilería" },
  { value: "Acabados", label: "Acabados" },
  { value: "Entrega y postventa", label: "Entrega y postventa" },
];

export default function ObraForm({ modo = "crear", obra: obraInicial = {}, closeModal, handleCancel, onSubmit }) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const inputRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [errores, setErrores] = useState({});

  const esCrear = modo === "crear";

  const [obra, setObraInterna] = useState(obraInicial);

  const schema = obraSchema(esCrear)

  const handleChange = (campo, valor) => {
    setUsuarioInterno((prev) => ({ ...prev, [campo]: valor }));
  };


  const handleSubmit = async (e) => {
    console.log("enviando datos");

    e.preventDefault();
    try {
      const datosValidados = await schema.validate(obra, {
        abortEarly: false,
      });
      setErrores({})
      onSubmit(datosValidados)
      closeModal()
    } catch (error) {
      console.log("error", error);
      
      const nuevosErrores = {};
      error.inner.forEach((e) => {
        nuevosErrores[e.path] = e.message;
      });
      console.log("nuevos errores", nuevosErrores);
      
      setErrores(nuevosErrores);
    }
  }

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "pe" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const direccion = place.formatted_address;
        const componentes = place.address_components;

        const get = (tipo) =>
          componentes.find((c) => c.types.includes(tipo))?.long_name || "";

        const ubicacion = [
          get("administrative_area_level_1"),
          get("administrative_area_level_2"),
          get("country"),
        ]
          .filter(Boolean)
          .join(", ");

        const latitud = place.geometry.location.lat();
        const longitud = place.geometry.location.lng();

        setObraInterna((prev) => ({
          ...prev,
          direccion,
          ubicacion,
          latitud,
          longitud,
        }));

        setMapCenter({ lat: latitud, lng: longitud });
      });
    }
  }, [isLoaded]);

  return (

    <div className="max-h-96 overflow-y-auto px-2">
      <form id="form-obra" onSubmit={handleSubmit} className="gestion-form-global" autoComplete="off">

        <div className="form-group">
          <Label htmlFor="nombre">Nombre de la Obra *</Label>
          <Input
            type="text"
            value={obra.nombre}
            onChange={(e) => {
              setObraInterna({ ...obra, nombre: e.target.value });
            }}

          />
          {errores.nombre && (
            <p className="error-message">{errores.nombre}</p>
          )}
        </div>

      
        <div className="form-group">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            type="text"
            ref={inputRef}
            value={obra.direccion}
            onChange={(e) => setObraInterna({ ...obra, direccion: e.target.value })}
            placeholder="Buscar dirección en el mapa"

          />
          {errores.direccion && (
            <p className="error-message">{errores.direccion}</p>
          )}
        </div>


        <div className="form-group">
          <Label htmlFor="Ubicacion">Ubicación</Label>
          <Input type="text" value={obra.ubicacion || ""} readOnly />
        </div>


        <div className="form-group">
          <Label htmlFor="Etapa de obra">Etapa de la obra *</Label>
     

          <Select
            value={obra.estado}
            onValueChange={(value) =>
              setObraInterna({ ...obra, estado: value })
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planificación">Planificación</SelectItem>
              <SelectItem value="Demolición">Demolición</SelectItem>
              <SelectItem value="Cimentación y estructura">Cimentación y estructura</SelectItem>
              <SelectItem value="Cerramientos y albañilería">
                Cerramientos y albañilería
              </SelectItem>
              <SelectItem value="Acabados">Acabados</SelectItem>
              <SelectItem value="Entrega y postventa">
                Entrega y postventa
              </SelectItem>
            </SelectContent>
          </Select>
          {errores.estado && (
            <p className="error-message">{errores.estado}</p>
          )}

        </div>


        {isLoaded && obra.latitud && obra.longitud && (
          <div className="map-container">
            <GoogleMap
              center={{ lat: obra.latitud, lng: obra.longitud }}
              zoom={16}
              mapContainerStyle={mapContainerStyle}
            >
              <Marker position={{ lat: obra.latitud, lng: obra.longitud }} />
            </GoogleMap>


          </div>
        )}


        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button className="bg-sky-950" type="submit" form="form-obra">
            {esCrear ? "Crear Obra" : "Actualizar Obra"}
          </Button>
        </AlertDialogFooter>
      </form>
    </div>
  );
}