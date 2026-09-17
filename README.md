# Explorador de Clima

Aplicación web que busca una ciudad y muestra su clima actual, calidad del aire, pronóstico de 7
días y tendencia de calidad del aire a 3 días, consumiendo la API de [Weatherbit](https://www.weatherbit.io/)
en tiempo real. Al abrir la app, muestra por defecto el clima de tu ubicación actual (si das el
permiso) o de Quito.

Entregable para el curso Desarrollo Web 2 — USFQ.

## Stack

- React + TypeScript
- Vite

## Setup

1. Clona el repositorio e instala las dependencias:

   ```bash
   npm install
   ```

2. Consigue una API key gratuita en [weatherbit.io/api](https://www.weatherbit.io/api) (necesitas
   registrarte, es gratis). El plan gratuito incluye clima actual, pronóstico por hora, pronóstico
   de 7 días y calidad del aire — todo lo que usa esta app. Tiene un límite de 50 llamadas por día.

3. Copia `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_WEATHERBIT_KEY` | Tu API key de Weatherbit. Sin ella, la app no arranca (falla con un mensaje explicando qué falta). |

Edita `.env` y pega tu key:

```
VITE_WEATHERBIT_KEY=tu_api_key_aqui
```

## Cómo correr

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

**Importante:** la app pide tu ubicación al navegador, lo cual solo funciona en `localhost` o
HTTPS — no funciona si abres el `index.html` directamente desde el explorador de archivos
(`file://`). Usa siempre `npm run dev`.

Otros comandos disponibles:

```bash
npm run build     # build de producción
npm run preview   # sirve el build de producción localmente
```

## Notas

- La API key queda visible en el navegador (DevTools → Network), ya que esta app no tiene backend
  que la oculte. Es una limitación aceptada para un proyecto sin servidor propio — no compartas tu
  `.env` ni subas tu key a un repositorio público.
- Las búsquedas se cachean por 10 minutos en `localStorage` para no agotar la cuota diaria de la
  API (50 llamadas/día en el plan gratuito).
