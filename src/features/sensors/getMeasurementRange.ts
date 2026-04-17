import type { AlarmDataType, HubConfig } from "../../types";

export function getMeasurementRange(
  measurementKey: AlarmDataType,
  config: HubConfig | null
): { min: number; max: number } | null {
  if (!config) return null;

  switch (measurementKey) {
    case "temperature":
      return { min: config.min_temperature, max: config.max_temperature };
    case "humidity":
      return { min: config.min_hum, max: config.max_hum };
    default:
      return null;
  }
}
