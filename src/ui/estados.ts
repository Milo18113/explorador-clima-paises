import type { ReporteClima } from "../domain/types";
import type { ErrorClimaTipo } from "../infrastructure/weatherbitClient";

export type EstadoUI =
  | { tipo: "validacion"; mensaje: string }
  | { tipo: "cargando" }
  | { tipo: "exito"; reporte: ReporteClima }
  | { tipo: "error"; mensaje: string; onReintentar: () => void };

// Un mensaje por tipo de error real, en vez de "algo salió mal" genérico —
// "no encontramos esa ciudad" le dice al usuario qué hacer distinto.
const MENSAJES_ERROR: Record<ErrorClimaTipo, string> = {
  "ciudad-no-encontrada": "No encontramos esa ciudad. Revisa cómo la escribiste.",
  "key-invalida": "La API key no es válida. Revisa tu archivo .env.",
  "cuota-agotada": "Se agotó la cuota diaria de la API. Intenta de nuevo mañana.",
  "sin-conexion": "No hay conexión a internet.",
  desconocido: "Ocurrió un error inesperado.",
};

export function mensajeDeError(tipo: ErrorClimaTipo): string {
  return MENSAJES_ERROR[tipo];
}

function crearSkeletonTarjeta(): string {
  return `<div class="tarjeta tarjeta--skeleton"><div class="skeleton-shimmer"></div></div>`;
}

function renderCargando(contenedor: HTMLElement): void {
  contenedor.innerHTML = `
    <div class="grid-tarjetas" aria-busy="true" aria-live="polite">
      ${crearSkeletonTarjeta()}
      ${crearSkeletonTarjeta()}
      ${crearSkeletonTarjeta()}
      ${crearSkeletonTarjeta()}
    </div>
  `;
}

function renderValidacion(contenedor: HTMLElement, mensaje: string): void {
  contenedor.innerHTML = `<p class="mensaje mensaje--validacion" role="alert">${mensaje}</p>`;
}

function renderError(contenedor: HTMLElement, mensaje: string, onReintentar: () => void): void {
  contenedor.innerHTML = `
    <div class="mensaje mensaje--error" role="alert">
      <p>${mensaje}</p>
      <button type="button" class="boton-reintentar">Reintentar</button>
    </div>
  `;
  contenedor.querySelector(".boton-reintentar")?.addEventListener("click", onReintentar);
}

/**
 * Punto único de render de estado. El caso "exito" no pinta las tarjetas
 * aquí — devuelve el reporte para que main.ts lo pase a ui/tarjeta*.ts,
 * que todavía no existen en esta fase.
 */
export function renderEstado(contenedor: HTMLElement, estado: EstadoUI): void {
  switch (estado.tipo) {
    case "validacion":
      renderValidacion(contenedor, estado.mensaje);
      return;
    case "cargando":
      renderCargando(contenedor);
      return;
    case "error":
      renderError(contenedor, estado.mensaje, estado.onReintentar);
      return;
    case "exito":
      // Se reemplaza en la fase 5 cuando existan las tarjetas reales.
      contenedor.innerHTML = "";
      return;
  }
}
