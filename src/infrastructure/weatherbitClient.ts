import { agruparAqiPorDia } from "../domain/agregaciones";
import type {
  CalidadAireActual,
  ClimaActual,
  DiaPronostico,
  PronosticoSemanal,
  ReporteClima,
  TendenciaCalidadAire,
  Ubicacion,
} from "../domain/types";
import { weatherbitKey } from "./config";

const BASE_URL = "https://api.weatherbit.io/v2.0";

export type ErrorClimaTipo =
  | "ciudad-no-encontrada"
  | "key-invalida"
  | "cuota-agotada"
  | "sin-conexion"
  | "desconocido";

export class ErrorClima extends Error {
  constructor(public readonly tipo: ErrorClimaTipo, message: string) {
    super(message);
  }
}

// Weatherbit acepta "?city=" o "?lat=&lon=" — este tipo evita mezclar ambos por error.
export type ConsultaUbicacion = { city: string } | { lat: number; lon: number };

function iconoUrl(icono: string): string {
  return `https://cdn.weatherbit.io/static/img/icons/${icono}.png`;
}

function paramsDeUbicacion(consulta: ConsultaUbicacion): string {
  if ("city" in consulta) return `city=${encodeURIComponent(consulta.city)}`;
  return `lat=${consulta.lat}&lon=${consulta.lon}`;
}

async function obtenerJson(ruta: string): Promise<any> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}&key=${weatherbitKey}`);
  } catch {
    throw new ErrorClima("sin-conexion", "No se pudo conectar. Revisa tu conexión a internet.");
  }

  if (respuesta.status === 403) {
    throw new ErrorClima("key-invalida", "La API key no es válida o no tiene acceso a este endpoint.");
  }
  if (respuesta.status === 429) {
    throw new ErrorClima("cuota-agotada", "Se agotó la cuota diaria de la API. Intenta más tarde.");
  }
  if (!respuesta.ok) {
    throw new ErrorClima("desconocido", `Error inesperado del servidor (${respuesta.status}).`);
  }

  const json = await respuesta.json();

  // Weatherbit responde 200 con data: [] cuando la ciudad no existe, en vez de un 404.
  if (Array.isArray(json.data) && json.data.length === 0) {
    throw new ErrorClima("ciudad-no-encontrada", "No encontramos esa ciudad.");
  }

  return json;
}

export async function obtenerReporteClima(consulta: ConsultaUbicacion): Promise<ReporteClima> {
  const params = paramsDeUbicacion(consulta);

  const [actual, hourly, daily, airquality] = await Promise.all([
    obtenerJson(`/current?${params}`),
    obtenerJson(`/forecast/hourly?hours=24&${params}`),
    obtenerJson(`/forecast/daily?days=7&${params}`),
    obtenerJson(`/forecast/airquality?${params}`),
  ]);

  const datoActual = actual.data[0];

  const ubicacion: Ubicacion = {
    nombre: datoActual.city_name,
    region: datoActual.state_code ?? "",
    pais: datoActual.country_code,
    lat: datoActual.lat,
    lon: datoActual.lon,
  };

  const climaActual: ClimaActual = {
    ubicacion,
    temperaturaC: datoActual.temp,
    condicionCodigo: datoActual.weather.code,
    condicionDescripcion: datoActual.weather.description,
    iconoUrl: iconoUrl(datoActual.weather.icon),
    horas: hourly.data.map((h: any) => ({
      fechaHora: h.timestamp_local,
      temperaturaC: h.temp,
      probabilidadLluvia: h.pop,
      condicionCodigo: h.weather.code,
      condicionDescripcion: h.weather.description,
      iconoUrl: iconoUrl(h.weather.icon),
    })),
  };

  const horasAqi = airquality.data.map((h: any) => ({
    fechaHora: h.timestamp_local,
    aqi: h.aqi,
  }));

  // AQI y contaminantes "actuales" salen de la primera hora de /forecast/airquality,
  // no de una llamada aparte a /current/airquality — así la tarjeta 4 no cuesta cuota extra.
  // Igual que /forecast/hourly para el clima, la API ya devuelve las horas empezando
  // desde ahora — solo hay que cortar cuando cruza a la fecha de mañana.
  const horaAqiActual = airquality.data[0];
  const hoyISO = horaAqiActual.timestamp_local.slice(0, 10);
  const horasRestantesDeHoy: { fechaHora: string; aqi: number }[] = [];
  for (const h of horasAqi) {
    if (h.fechaHora.slice(0, 10) !== hoyISO) break;
    horasRestantesDeHoy.push(h);
  }

  const calidadAireActual: CalidadAireActual = {
    aqi: horaAqiActual.aqi,
    contaminantes: {
      pm25: horaAqiActual.pm25 ?? 0,
      pm10: horaAqiActual.pm10 ?? 0,
      o3: horaAqiActual.o3 ?? 0,
      no2: horaAqiActual.no2 ?? 0,
      co: horaAqiActual.co ?? 0,
      so2: horaAqiActual.so2 ?? 0,
    },
    horas: horasRestantesDeHoy,
  };

  const pronosticoSemanal: PronosticoSemanal = {
    dias: daily.data.map(
      (d: any): DiaPronostico => ({
        fecha: d.datetime,
        temperaturaMaxC: d.max_temp,
        temperaturaMinC: d.min_temp,
        probabilidadLluvia: d.pop,
        condicionCodigo: d.weather.code,
        condicionDescripcion: d.weather.description,
        iconoUrl: iconoUrl(d.weather.icon),
      }),
    ),
  };

  const tendenciaCalidadAire: TendenciaCalidadAire = {
    dias: agruparAqiPorDia(horasAqi),
  };

  return { climaActual, calidadAireActual, pronosticoSemanal, tendenciaCalidadAire };
}
