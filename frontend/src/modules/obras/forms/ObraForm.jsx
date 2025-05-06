import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Select from "react-select";

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

export default function ObraForm({ obra, setObra, onCancel, onSubmit }) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const inputRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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

        setObra((prev) => ({
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
    <form onSubmit={onSubmit} className="gestion-form-global">
      {/* Nombre */}
      <div className="form-group">
        <label>Nombre de la Obra *</label>
        <input
          type="text"
          value={obra.nombre}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, "");
            setObra({ ...obra, nombre: value });
          }}
          required
        />
      </div>

      {/* Dirección con Autocomplete */}
      <div className="form-group">
        <label>Dirección *</label>
        <input
          type="text"
          ref={inputRef}
          value={obra.direccion}
          onChange={(e) => setObra({ ...obra, direccion: e.target.value })}
          placeholder="Buscar dirección en el mapa"
          required
        />
      </div>

      {/* Ubicación automática */}
      <div className="form-group">
        <label>Ubicación</label>
        <input type="text" value={obra.ubicacion || ""} readOnly />
      </div>

      {/* Estado de la obra */}
      <div className="form-group">
        <label>Etapa de la obra *</label>
        <Select
          options={estadosObra}
          value={estadosObra.find((e) => e.value === obra.estado) || null}
          onChange={(selected) =>
            setObra({ ...obra, estado: selected ? selected.value : "" })
          }
          placeholder="Selecciona una etapa..."
        />
      </div>

      {/* Mapa */}
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

      {/* Botones */}
      <button type="submit" className="btn-guardar">
        💾 Guardar
      </button>
      <button type="button" className="btn-cancelar" onClick={onCancel}>
        ❌ Cancelar
      </button>
    </form>
  );
}