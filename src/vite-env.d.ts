/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEQUENCE_PROJECT_ACCESS_KEY: string
  readonly VITE_SEQUENCE_WAAS_CONFIG_KEY: string
  readonly VITE_SEQUENCE_INDEXER_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_APPLE_CLIENT_ID: string
  readonly VITE_PLAYFAB_TITLE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
