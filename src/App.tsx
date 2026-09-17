import { useState, type CSSProperties, type FormEvent } from "react";
import { temaPorAqi, temaPorCondicion, TEMA_PRONOSTICO_SEMANAL, type Tema } from "./domain/tema";
import type {
  CalidadAireActual,
  ClimaActual,
  DiaCalidadAire,
  DiaPronostico,
  HoraCalidadAire,
  HoraPronostico,
  PronosticoSemanal,
  ReporteClima,
  TendenciaCalidadAire,
} from "./domain/types";
import { useReporteClima } from "./hooks/useReporteClima";

// TypeScript no tipa custom properties (--x) en CSSProperties de forma nativa.
function estiloTema(tema: Tema): CSSProperties {
  return {
    "--color-fondo": tema.colorFondo,
    "--color-texto": tema.colorTexto,
    "--color-acento": tema.colorAcento,
  } as CSSProperties;
}

function formatearHora(fechaHora: string): string {
  return new Date(fechaHora).toLocaleTimeString("es", { hour: "numeric" });
}

function formatearDia(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es", { weekday: "short" });
}

function BarraBusqueda({ onBuscar }: { onBuscar: (texto: string) => void }) {
  const [texto, setTexto] = useState("");

  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    onBuscar(texto);
  }

  return (
    <form className="barra-busqueda" onSubmit={manejarEnvio}>
      <input
        type="text"
        className="barra-busqueda__input"
        placeholder="Buscar ciudad..."
        autoComplete="off"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit" className="barra-busqueda__boton">
        Buscar
      </button>
    </form>
  );
}

function TarjetaClimaActual({ clima }: { clima: ClimaActual }) {
  const tema = temaPorCondicion(clima.condicionCodigo);

  return (
    <article className="tarjeta tarjeta--clima-actual" style={estiloTema(tema)}>
      <header className="tarjeta__cabecera">
        <p className="tarjeta__ubicacion">
          {clima.ubicacion.nombre}
          {clima.ubicacion.region ? `, ${clima.ubicacion.region}` : ""}
        </p>
        <div className="tarjeta__principal">
          <img src={clima.iconoUrl} alt={clima.condicionDescripcion} className="tarjeta__icono-grande" />
          <span className="tarjeta__temperatura">{Math.round(clima.temperaturaC)}°</span>
        </div>
        <p className="tarjeta__condicion">{clima.condicionDescripcion}</p>
      </header>
      <div className="fila-horas">
        {clima.horas.map((hora: HoraPronostico) => (
          <div className="hora-item" key={hora.fechaHora}>
            <span className="hora-item__hora">{formatearHora(hora.fechaHora)}</span>
            <img className="hora-item__icono" src={hora.iconoUrl} alt={hora.condicionDescripcion} />
            <span className="hora-item__temp">{Math.round(hora.temperaturaC)}°</span>
            <span className="hora-item__lluvia">{hora.probabilidadLluvia}%</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function TarjetaCalidadAire({ aire }: { aire: CalidadAireActual }) {
  const tema = temaPorAqi(aire.aqi);

  return (
    <article className="tarjeta tarjeta--calidad-aire" style={estiloTema(tema)}>
      <header className="tarjeta__cabecera">
        <p className="tarjeta__titulo">Calidad del aire</p>
        <div className="tarjeta__principal">
          <span className="tarjeta__temperatura">{aire.aqi}</span>
        </div>
        <p className="tarjeta__condicion">{tema.etiqueta}</p>
      </header>
      <div className="fila-horas">
        {aire.horas.map((hora: HoraCalidadAire) => (
          <div className="hora-item" key={hora.fechaHora}>
            <span className="hora-item__hora">{formatearHora(hora.fechaHora)}</span>
            <span className="hora-item__temp">{hora.aqi}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function TarjetaPronostico({ pronostico }: { pronostico: PronosticoSemanal }) {
  return (
    <article className="tarjeta tarjeta--pronostico" style={estiloTema(TEMA_PRONOSTICO_SEMANAL)}>
      <header className="tarjeta__cabecera">
        <p className="tarjeta__titulo">Próximos días</p>
      </header>
      <div className="lista-dias">
        {pronostico.dias.map((dia: DiaPronostico) => (
          <div className="dia-item" key={dia.fecha}>
            <span className="dia-item__nombre">{formatearDia(dia.fecha)}</span>
            <img className="dia-item__icono" src={dia.iconoUrl} alt={dia.condicionDescripcion} />
            <span className="dia-item__lluvia">{dia.probabilidadLluvia}%</span>
            <span className="dia-item__temps">
              {Math.round(dia.temperaturaMaxC)}° / {Math.round(dia.temperaturaMinC)}°
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function TarjetaTendenciaAire({ tendencia }: { tendencia: TendenciaCalidadAire }) {
  // El color de la tarjeta refleja el peor día, no el más reciente — es la
  // alerta que más le importa a quien la lee de un vistazo.
  const peorAqi = Math.max(...tendencia.dias.map((d) => d.aqiMaximo));
  const tema = temaPorAqi(peorAqi);

  return (
    <article className="tarjeta tarjeta--tendencia-aire" style={estiloTema(tema)}>
      <header className="tarjeta__cabecera">
        <p className="tarjeta__titulo">Tendencia del aire</p>
      </header>
      <div className="lista-dias">
        {tendencia.dias.map((dia: DiaCalidadAire) => (
          <div className="dia-item" key={dia.fecha}>
            <span className="dia-item__nombre">{dia.esParcial ? "Hoy" : formatearDia(dia.fecha)}</span>
            <span className="dia-item__temps">{dia.aqiMaximo}</span>
            <span className="dia-item__lluvia">{temaPorAqi(dia.aqiMaximo).etiqueta}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Tarjetas({ reporte }: { reporte: ReporteClima }) {
  return (
    <div className="grid-tarjetas">
      <TarjetaClimaActual clima={reporte.climaActual} />
      <TarjetaCalidadAire aire={reporte.calidadAireActual} />
      <TarjetaPronostico pronostico={reporte.pronosticoSemanal} />
      <TarjetaTendenciaAire tendencia={reporte.tendenciaCalidadAire} />
    </div>
  );
}

function SkeletonTarjetas() {
  return (
    <div className="grid-tarjetas" aria-busy="true" aria-live="polite">
      {[0, 1, 2, 3].map((i) => (
        <div className="tarjeta tarjeta--skeleton" key={i}>
          <div className="skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { estado, buscar, reintentar } = useReporteClima();

  return (
    <>
      <header className="encabezado">
        <h1 className="encabezado__saludo">¡Revisa el clima de hoy!</h1>
        <BarraBusqueda onBuscar={buscar} />
      </header>
      <main className="contenido">
        {estado.tipo === "cargando" && <SkeletonTarjetas />}
        {estado.tipo === "exito" && <Tarjetas reporte={estado.reporte} />}
        {estado.tipo === "validacion" && (
          <p className="mensaje mensaje--validacion" role="alert">
            {estado.mensaje}
          </p>
        )}
        {estado.tipo === "error" && (
          <div className="mensaje mensaje--error" role="alert">
            <p>{estado.mensaje}</p>
            <button type="button" className="boton-reintentar" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        )}
      </main>
    </>
  );
}
