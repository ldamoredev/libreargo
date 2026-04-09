export const COLORS = {
  primary: "#2E7D32",
  primaryLight: "#4CAF50",
  primaryDark: "#1B5E20",
  secondary: "#FF8F00",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  error: "#D32F2F",
  warning: "#F57C00",
  success: "#388E3C",
  text: "#212121",
  textSecondary: "#757575",
  textDisabled: "#BDBDBD",
  border: "#E0E0E0",
  connected: "#4CAF50",
  disconnected: "#BDBDBD",
} as const;

export const DIRECT_MODE_IP = "192.168.4.1" as const;
export const HUB_PORT = 80 as const;

export const POLLING_INTERVAL_MS = 30_000 as const; // 30s default
export const TOGGLE_THROTTLE_MS = 2_000 as const; // 2s entre toggles
export const CONNECTION_TIMEOUT_MS = 5_000 as const; // 5s timeout
