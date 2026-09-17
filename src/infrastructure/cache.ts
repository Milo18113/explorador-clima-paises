const TTL_MS = 10 * 60 * 1000;
const PREFIJO = "explorador-clima:";

interface EntradaCache<T> {
  guardadoEn: number;
  datos: T;
}

export function obtenerCache<T>(clave: string): T | null {
  const crudo = localStorage.getItem(PREFIJO + clave);
  if (!crudo) return null;

  // Un dato corrupto o de un formato viejo no debe romper la búsqueda actual.
  let entrada: EntradaCache<T>;
  try {
    entrada = JSON.parse(crudo);
  } catch {
    localStorage.removeItem(PREFIJO + clave);
    return null;
  }

  const expirado = Date.now() - entrada.guardadoEn > TTL_MS;
  if (expirado) {
    localStorage.removeItem(PREFIJO + clave);
    return null;
  }

  return entrada.datos;
}

export function guardarCache<T>(clave: string, datos: T): void {
  const entrada: EntradaCache<T> = { guardadoEn: Date.now(), datos };
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(entrada));
  } catch {
    // Cuota de localStorage llena (modo incógnito, etc.) — no vale la pena
    // romper la búsqueda por esto, simplemente no se cachea.
  }
}

/** Normaliza para que "Quito" y "quito " compartan la misma entrada de caché. */
export function claveDeUbicacion(texto: string): string {
  return texto.trim().toLowerCase();
}
