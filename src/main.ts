import { obtenerReporteClima } from "./infrastructure/weatherbitClient";

// Prueba temporal de la fase 3: muestra el reporte crudo para validar el
// mapeo del cliente antes de construir la UI real (fases 4-5).
const app = document.getElementById("app")!;
app.innerHTML = "<p>Cargando...</p>";

obtenerReporteClima({ lat: -0.1807, lon: -78.4678 })
  .then((reporte) => {
    app.innerHTML = `<pre>${JSON.stringify(reporte, null, 2)}</pre>`;
  })
  .catch((error) => {
    app.innerHTML = `<p>Error: ${error.message}</p>`;
  });
