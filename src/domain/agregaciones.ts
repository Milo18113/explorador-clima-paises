import type { DiaCalidadAire, HoraCalidadAire } from "./types";

/**
 * Weatherbit no da AQI por día, solo por hora. Se agrupa por fecha local y se
 * toma el máximo (no el promedio): un pico dañino a media tarde es lo que
 * importa para la salud, y un promedio lo diluye hasta esconderlo.
 */
export function agruparAqiPorDia(horas: HoraCalidadAire[]): DiaCalidadAire[] {
  const hoy = new Date().toISOString().slice(0, 10);
  const porFecha = new Map<string, number>();

  for (const hora of horas) {
    const fecha = hora.fechaHora.slice(0, 10);
    const actual = porFecha.get(fecha);
    if (actual === undefined || hora.aqi > actual) {
      porFecha.set(fecha, hora.aqi);
    }
  }

  return [...porFecha.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, aqiMaximo]) => ({
      fecha,
      aqiMaximo,
      esParcial: fecha === hoy,
    }));
}
