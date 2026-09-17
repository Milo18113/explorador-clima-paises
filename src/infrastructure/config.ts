// Falla al cargar la página, no a mitad de una búsqueda — mejor un error claro
// en consola que un 401 confuso cuando el usuario ya está usando la app.
const key = import.meta.env.VITE_WEATHERBIT_KEY;

if (!key) {
  throw new Error(
    "Falta VITE_WEATHERBIT_KEY en .env. Copia .env.example a .env y agrega tu API key de Weatherbit.",
  );
}

export const weatherbitKey: string = key;
