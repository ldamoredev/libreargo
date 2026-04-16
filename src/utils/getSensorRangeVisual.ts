import type { Device, HubConfig, SensorData, SensorRangeVisual } from "../types";
import {
  ACTUAL_KEY_MAP,
  PRIMARY_VISUAL_MEASUREMENT,
  SENSOR_MEASUREMENTS,
  UNIT_MAP,
} from "../features/sensors/sensorMeasurementCatalog";

function getRangeForMeasurement(
  measurement: string,
  config: HubConfig
): { min: number; max: number } | null {
  if (measurement === "temperature") {
    return { min: config.min_temperature, max: config.max_temperature };
  }
  if (measurement === "humidity") {
    return { min: config.min_hum, max: config.max_hum };
  }
  return null;
}

export function getSensorRangeVisual(
  device: Device,
  config: HubConfig | null,
  actual: SensorData | null
): SensorRangeVisual | null {
  if (device.type !== "sensor" || !config || !actual) {
    return null;
  }

  const measurement = PRIMARY_VISUAL_MEASUREMENT[device.subtype];
  if (!measurement) {
    return null;
  }

  const measurementMeta =
    (SENSOR_MEASUREMENTS[device.subtype] ?? []).find(
      (item) => item.key === measurement
    ) ?? null;
  const range = getRangeForMeasurement(measurement, config);
  const actualKey = ACTUAL_KEY_MAP[measurement];
  const current = Number.parseFloat(actual[actualKey]);

  if (
    !measurementMeta ||
    !range ||
    !Number.isFinite(current) ||
    range.min >= range.max
  ) {
    return null;
  }

  return {
    label: measurementMeta.label,
    unit: UNIT_MAP[measurement],
    min: range.min,
    max: range.max,
    current,
  };
}
