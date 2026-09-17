import "./styles.css";
import { claveDeUbicacion, guardarCache, obtenerCache } from "./infrastructure/cache";
import { ErrorClima, obtenerReporteClima } from "./infrastructure/weatherbitClient";
import { crearBarraBusqueda } from "./ui/barraBusqueda";
import { mensajeDeError, renderEstado } from "./ui/estados";
import type { ReporteClima } from "./domain/types";

const app = document.getElementById("app")!;

app.innerHTML = `
  <header class="encabezado">
    <h1 class="encabezado__saludo">¡Revisa el clima de hoy!</h1>
  </header>
  <main class="contenido"></main>
`;

const encabezado = app.querySelector(".encabezado")!;
const contenido = app.querySelector(".contenido") as HTMLElement;

async function buscar(ciudad: string): Promise<void> {
  renderEstado(contenido, { tipo: "cargando" });

  const clave = claveDeUbicacion(ciudad);
  const cacheado = obtenerCache<ReporteClima>(clave);
  if (cacheado) {
    mostrarExito(cacheado);
    return;
  }

  try {
    const reporte = await obtenerReporteClima({ city: ciudad });
    guardarCache(clave, reporte);
    mostrarExito(reporte);
  } catch (error) {
    const mensaje = error instanceof ErrorClima ? mensajeDeError(error.tipo) : "Ocurrió un error inesperado.";
    renderEstado(contenido, { tipo: "error", mensaje, onReintentar: () => buscar(ciudad) });
  }
}

function mostrarExito(reporte: ReporteClima): void {
  // Placeholder hasta la fase 5 — ahí esto se reemplaza por las 4 tarjetas reales.
  contenido.innerHTML = `<pre>${JSON.stringify(reporte, null, 2)}</pre>`;
}

const barra = crearBarraBusqueda(
  (texto) => buscar(texto),
  (mensaje) => renderEstado(contenido, { tipo: "validacion", mensaje }),
);
encabezado.appendChild(barra.elemento);

// Sin carga automática todavía: cada búsqueda debe ser una acción explícita
// mientras no exista caché de por medio de forma predecible (fase 6: geolocalización).
