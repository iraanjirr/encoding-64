// Definisi tipe untuk file audio
declare module "*.mp3" {
  const src: string
  export default src
}

declare module "*.wav" {
  const src: string
  export default src
}

declare module "*.ogg" {
  const src: string
  export default src
}

// Definisi tipe untuk Web Audio API
interface Window {
  webkitAudioContext: typeof AudioContext
}
