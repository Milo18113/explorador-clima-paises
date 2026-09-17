import { useRef, useState } from "react";
import type { ReporteClima } from "../domain/types";
import { claveDeUbicacion, guardarCache, obtenerCache } from "../infrastructure/cache";
import { ErrorClima, obtenerReporteClima, type ErrorClimaTipo } from "../infrastructure/weatherbitClient";

export type EstadoUI =
  | { tipo: "inicial" }
  | { tipo: "validacion"; mensaje: string }
  | { tipo: "cargando" }
  | { tipo: "exito"; reporte: ReporteClima }
  | { tipo: "error"; mensaje: string };

// Un mensaje por tipo de error real, en vez de "algo salió mal" genérico —
// "no encontramos esa ciudad" le dice al usuario qué hacer distinto.
const MENSAJES_ERROR: Record<ErrorClimaTipo, string> = {
  "ciudad-no-encontrada": "No encontramos esa ciudad. Revisa cómo la escribiste.",
  "key-invalida": "La API key no es válida. Revisa tu archivo .env.",
  "cuota-agotada": "Se agotó la cuota diaria de la API. Intenta de nuevo mañana.",
  "sin-conexion": "No hay conexión a internet.",
  desconocido: "Ocurrió un error inesperado.",
};

export function useReporteClima() {
  const [estado, setEstado] = useState<EstadoUI>({ tipo: "inicial" });
  // Un ref, no state: reintentar no debe disparar un render propio, solo
  // relanzar la búsqueda anterior.
  const ultimaBusqueda = useRef<string | null>(null);

  async function buscar(ciudad: string): Promise<void> {
    const texto = ciudad.trim();
    if (!texto) {
      setEstado({ tipo: "validacion", mensaje: "Escribe el nombre de una ciudad antes de buscar." });
      return;
    }

    ultimaBusqueda.current = texto;
    setEstado({ tipo: "cargando" });

    const clave = claveDeUbicacion(texto);
    const cacheado = obtenerCache<ReporteClima>(clave);
    if (cacheado) {
      setEstado({ tipo: "exito", reporte: cacheado });
      return;
    }

    try {
      const reporte = await obtenerReporteClima({ city: texto });
      guardarCache(clave, reporte);
      setEstado({ tipo: "exito", reporte });
    } catch (error) {
      const mensaje = error instanceof ErrorClima ? MENSAJES_ERROR[error.tipo] : MENSAJES_ERROR.desconocido;
      setEstado({ tipo: "error", mensaje });
    }
  }

  function reintentar(): void {
    if (ultimaBusqueda.current) buscar(ultimaBusqueda.current);
  }

  return { estado, buscar, reintentar };
}
