export async function buscarDireccionGoogle(direccion, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      direccion
    )}&key=${apiKey}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
  
      const direccionFormateada = result.formatted_address;
      const coordenadas = result.geometry.location;
  
      return {
        direccion: direccionFormateada,
        ubicacion: obtenerUbicacionDesdeComponentes(result.address_components),
        coordenadas,
      };
    } else {
      throw new Error("No se encontró la dirección con Google Maps.");
    }
  }
  
  function obtenerUbicacionDesdeComponentes(components) {
    const get = (type) =>
      components.find((c) => c.types.includes(type))?.long_name || "";
  
    return [get("administrative_area_level_1"), get("administrative_area_level_2"), get("country")]
      .filter(Boolean)
      .join(", ");
  }  