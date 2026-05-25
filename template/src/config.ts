export interface RuntimeConfig {
  [key: string]: unknown
}

let _config: RuntimeConfig = {}

export async function loadConfig(): Promise<void> {
  try {
    const res = await fetch('/config.json')
    if (res.ok) {
      _config = (await res.json()) as RuntimeConfig
    }
  } catch {
    // No runtime config available — defaults in public/config.json apply
  }
}

export function getConfig(): RuntimeConfig {
  return _config
}
