/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_LIVEKIT_URL: string
  readonly VITE_LIVEKIT_DEMO_ROOM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
