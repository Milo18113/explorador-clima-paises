export interface Tema {
  id: string;
  etiqueta: string;
  colorFondo: string;
  colorTexto: string;
  colorAcento: string;
}

const TEMA_DESPEJADO: Tema = {
  id: "despejado",
  etiqueta: "Despejado",
  colorFondo: "#4FA8E0",
  colorTexto: "#FFFFFF",
  colorAcento: "#1D5D8A",
};

const TEMA_NUBLADO: Tema = {
  id: "nublado",
  etiqueta: "Nublado",
  colorFondo: "#8A97A3",
  colorTexto: "#FFFFFF",
  colorAcento: "#4E5960",
};

const TEMA_LLUVIA: Tema = {
  id: "lluvia",
  etiqueta: "Lluvia",
  colorFondo: "#4A6FA5",
  colorTexto: "#FFFFFF",
  colorAcento: "#233A5E",
};

const TEMA_TORMENTA: Tema = {
  id: "tormenta",
  etiqueta: "Tormenta",
  colorFondo: "#4B4E6D",
  colorTexto: "#FFFFFF",
  colorAcento: "#211F30",
};

const TEMA_NIEVE: Tema = {
  id: "nieve",
  etiqueta: "Nieve",
  colorFondo: "#AFC7D6",
  colorTexto: "#1B2B36",
  colorAcento: "#5A7A8C",
};

const TEMA_NIEBLA: Tema = {
  id: "niebla",
  etiqueta: "Niebla",
  colorFondo: "#B7BDBF",
  colorTexto: "#1B2326",
  colorAcento: "#6B7275",
};

// Rangos definidos por Weatherbit, no arbitrarios: https://www.weatherbit.io/api/codes
export function temaPorCondicion(codigo: number): Tema {
  if (codigo >= 200 && codigo < 300) return TEMA_TORMENTA;
  if (codigo >= 300 && codigo < 600) return TEMA_LLUVIA;
  if (codigo >= 600 && codigo < 700) return TEMA_NIEVE;
  if (codigo >= 700 && codigo < 800) return TEMA_NIEBLA;
  if (codigo === 800) return TEMA_DESPEJADO;
  if (codigo > 800 && codigo < 900) return TEMA_NUBLADO;
  return TEMA_NUBLADO;
}

// Fijo a propósito: esta tarjeta no debe reaccionar al clima real.
export const TEMA_PRONOSTICO_SEMANAL: Tema = TEMA_DESPEJADO;

const TEMA_AQI_BUENO: Tema = {
  id: "aqi-bueno",
  etiqueta: "Bueno",
  colorFondo: "#4CAF50",
  colorTexto: "#FFFFFF",
  colorAcento: "#2E7D32",
};

const TEMA_AQI_MODERADO: Tema = {
  id: "aqi-moderado",
  etiqueta: "Moderado",
  colorFondo: "#D4B106",
  colorTexto: "#1B1B00",
  colorAcento: "#8C7300",
};

const TEMA_AQI_DANINO_SENSIBLES: Tema = {
  id: "aqi-danino-sensibles",
  etiqueta: "Dañino para grupos sensibles",
  colorFondo: "#E07A2E",
  colorTexto: "#FFFFFF",
  colorAcento: "#8C4A15",
};

const TEMA_AQI_DANINO: Tema = {
  id: "aqi-danino",
  etiqueta: "Dañino",
  colorFondo: "#D64545",
  colorTexto: "#FFFFFF",
  colorAcento: "#7A1F1F",
};

const TEMA_AQI_MUY_DANINO: Tema = {
  id: "aqi-muy-danino",
  etiqueta: "Muy dañino",
  colorFondo: "#8E44AD",
  colorTexto: "#FFFFFF",
  colorAcento: "#4A2360",
};

const TEMA_AQI_PELIGROSO: Tema = {
  id: "aqi-peligroso",
  etiqueta: "Peligroso",
  colorFondo: "#6B1F2A",
  colorTexto: "#FFFFFF",
  colorAcento: "#3A0F15",
};

// Escala oficial del índice EPA (0-500), no algo que hayamos inventado.
export function temaPorAqi(aqi: number): Tema {
  if (aqi <= 50) return TEMA_AQI_BUENO;
  if (aqi <= 100) return TEMA_AQI_MODERADO;
  if (aqi <= 150) return TEMA_AQI_DANINO_SENSIBLES;
  if (aqi <= 200) return TEMA_AQI_DANINO;
  if (aqi <= 300) return TEMA_AQI_MUY_DANINO;
  return TEMA_AQI_PELIGROSO;
}

// Solo para AQI: thumbs en los extremos, círculo de color en los niveles
// intermedios — nombres de clase de bootstrap-icons, sin el prefijo "bi-".
export function iconoBootstrapPorAqi(aqi: number): string {
  if (aqi <= 50) return "hand-thumbs-up-fill";
  if (aqi <= 300) return "circle-fill";
  return "hand-thumbs-down-fill";
}
