export interface BarraBusqueda {
  elemento: HTMLElement;
}

/**
 * onBuscar solo se llama con texto ya validado (no vacío) — la barra
 * decide sola cuándo mostrar el estado de validación, sin que main.ts
 * tenga que duplicar esa lógica en cada punto donde se puede buscar.
 */
export function crearBarraBusqueda(
  onBuscar: (texto: string) => void,
  onValidacionFallida: (mensaje: string) => void,
): BarraBusqueda {
  const elemento = document.createElement("form");
  elemento.className = "barra-busqueda";
  elemento.innerHTML = `
    <input
      type="text"
      name="ciudad"
      class="barra-busqueda__input"
      placeholder="Buscar ciudad..."
      autocomplete="off"
    />
    <button type="submit" class="barra-busqueda__boton">Buscar</button>
  `;

  const input = elemento.querySelector("input")!;

  elemento.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = input.value.trim();

    if (!texto) {
      onValidacionFallida("Escribe el nombre de una ciudad antes de buscar.");
      return;
    }

    onBuscar(texto);
  });

  return { elemento };
}
