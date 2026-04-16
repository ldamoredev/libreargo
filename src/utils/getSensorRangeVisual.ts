import type { Device, HubConfig, SensorData, SensorRangeVisual } from "../types";
import {
  ACTUAL_KEY_MAP,
  UNIT_MAP,
  getPrimaryVisualMeasurement,
  type MeasurementKey,
} from "../features/sensors/sensorMeasurementCatalog";

function getRangeForMeasurement(
  measurement: MeasurementKey,
  config: HubConfig
): { min: number; max: number } | null {
  switch (measurement) {
    case "temperature":
      return { min: config.min_temperature, max: config.max_temperature };
    case "humidity":
      return { min: config.min_hum, max: config.max_hum };
    case "co2":
    case "pressure":
      return null;
  }

  const exhaustiveCheck: never = measurement;
  return exhaustiveCheck;
}

export function getSensorRangeVisual(
  device: Device,
  config: HubConfig | null,
  actual: SensorData | null
): SensorRangeVisual | null {
  if (device.type !== "sensor" || !config || !actual) {
    return null;
  }

  const measurementMeta = getPrimaryVisualMeasurement(device.subtype);
  if (!measurementMeta) {
    return null;
  }

  const range = getRangeForMeasurement(measurementMeta.key, config);
  const actualKey = ACTUAL_KEY_MAP[measurementMeta.key];
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
    unit: UNIT_MAP[measurementMeta.key],
    min: range.min,
    max: range.max,
    current,
  };
}
