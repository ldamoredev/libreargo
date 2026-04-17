import type { Device, HubConfig } from "../../types";
import { LABEL_MAP, resolveVisibleSensorMeasurement } from "./sensorMeasurementCatalog";

export function buildHubSensorDevices(config: HubConfig): readonly Device[] {
  return config.sensors
    .filter((sensor) => sensor.enabled)
    .flatMap((sensor, index) => {
      const sensorType = resolveVisibleSensorMeasurement(sensor);

      if (!sensorType) {
        return [];
      }

      return [
        {
          id: `sensor-${sensor.type}-${index}`,
          type: "sensor" as const,
          name: LABEL_MAP[sensorType],
          subtype: sensor.type,
          sensorType,
          zones: sensor.zones ?? [],
        },
      ];
    });
}
