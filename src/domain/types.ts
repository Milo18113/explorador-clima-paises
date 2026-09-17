export interface Ubicacion {
  nombre: string;
  region: string;
  pais: string;
  lat: number;
  lon: number;
}

export interface HoraPronostico {
  /** Fecha y hora local, ISO 8601. */
  fechaHora: string;
  temperaturaC: number;
  probabilidadLluvia: number;
  condicionCodigo: number;
  condicionDescripcion: string;
  iconoUrl: string;
}

export interface DiaPronostico {
  /** Fecha local, formato YYYY-MM-DD. */
  fecha: string;
  temperaturaMaxC: number;
  temperaturaMinC: number;
  probabilidadLluvia: number;
  condicionCodigo: number;
  condicionDescripcion: string;
  iconoUrl: string;
}

export interface ClimaActual {
  ubicacion: Ubicacion;
  temperaturaC: number;
  condicionCodigo: number;
  condicionDescripcion: string;
  iconoUrl: string;
  horas: HoraPronostico[];
}

export interface Contaminantes {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
}

export interface HoraCalidadAire {
  /** Fecha y hora local, ISO 8601. */
  fechaHora: string;
  aqi: number;
}

export interface CalidadAireActual {
  aqi: number;
  contaminantes: Contaminantes;
  horas: HoraCalidadAire[];
}

export interface DiaCalidadAire {
  /** Fecha local, formato YYYY-MM-DD. */
  fecha: string;
  /** Máximo de AQI observado ese día entre las horas disponibles. */
  aqiMaximo: number;
  /** true para el día actual, que solo cubre las horas restantes. */
  esParcial: boolean;
}

export interface PronosticoSemanal {
  dias: DiaPronostico[];
}

export interface TendenciaCalidadAire {
  dias: DiaCalidadAire[];
}

export interface ReporteClima {
  climaActual: ClimaActual;
  calidadAireActual: CalidadAireActual;
  pronosticoSemanal: PronosticoSemanal;
  tendenciaCalidadAire: TendenciaCalidadAire;
}
