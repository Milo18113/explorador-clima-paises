/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHERBIT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
