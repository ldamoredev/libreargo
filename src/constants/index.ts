export const COLORS = {
  // Brand
  primary: "#2E7D32",
  primaryLight: "#4CAF50",
  primaryDark: "#1B5E20",
  primarySoft: "#E8F3E8",
  secondary: "#FF8F00",
  // Surfaces (warm agricultural palette)
  background: "#F2EEE4",
  surface: "#FFFFFF",
  surfaceAlt: "#FAF7EF",
  // Status (semaphore — high contrast for outdoor use)
  error: "#C62828",
  errorSoft: "#FBDCDC",
  warning: "#F2A20C",
  warningSoft: "#FFEECC",
  success: "#2E7D32",
  successSoft: "#D7EBD6",
  // Actuator-specific (separate hue so on/off never reads as alarm)
  actuator: "#0E6E6E",
  actuatorSoft: "#DEF0EF",
  actuatorOff: "#BDB5A0",
  // Ink
  text: "#141414",
  textSecondary: "#4A4A4A",
  textMuted: "#8A8578",
  textDisabled: "#BDBDBD",
  border: "#E7E1D1",
  divider: "#E7E1D1",
  // Connectivity
  connected: "#2E7D32",
  disconnected: "#B8AF97",
} as const;

export const DIRECT_MODE_IP = "192.168.4.1" as const;
export const HUB_PORT = 80 as const;

export const POLLING_INTERVAL_MS = 30_000 as const; // 30s default
export const TOGGLE_THROTTLE_MS = 2_000 as const; // 2s entre toggles
export const CONNECTION_TIMEOUT_MS = 5_000 as const; // 5s timeout
export const ACTUATOR_VERIFY_DELAY_MS = 700 as const; // simula llegada de canal 2
export const ACTUATOR_VERIFY_TIMEOUT_MS = 3_000 as const; // ventana máx. de verificación
