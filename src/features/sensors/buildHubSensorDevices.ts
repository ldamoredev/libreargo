import type { AlarmDataType, Device, HubConfig } from "../../types";
import {
  getPrimaryVisualMeasurement,
  LABEL_MAP,
} from "./sensorMeasurementCatalog";

function readMeasurementKey(
  config: Record<string, unknown>
): AlarmDataType | null {
  const value = config.measurementKey;
  return value === "temperature" ||
    value === "humidity" ||
    value === "co2" ||
    value === "pressure"
    ? value
    : null;
}

export function buildHubSensorDevices(config: HubConfig): readonly Device[] {
  return config.sensors
    .filter((sensor) => sensor.enabled)
    .map((sensor, index) => {
      const sensorType =
        readMeasurementKey(sensor.config) ??
        getPrimaryVisualMeasurement(sensor.type)?.key ??
        "temperature";

      return {
        id: `sensor-${sensor.type}-${index}`,
        type: "sensor" as const,
        name: LABEL_MAP[sensorType],
        subtype: sensor.type,
        sensorType,
        zones: sensor.zones ?? [],
      };
    });
}
