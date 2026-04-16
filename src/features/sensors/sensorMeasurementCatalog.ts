import type { SensorData, SensorReading } from "../../types";

export type MeasurementKey = "temperature" | "humidity" | "co2" | "pressure";
export interface SensorMeasurementDefinition {
  readonly key: MeasurementKey;
  readonly label: string;
  readonly isPrimaryVisual?: true;
}

type ActualMeasurementKey = keyof Pick<
  SensorData,
  "a_temperature" | "a_humidity" | "a_co2" | "a_pressure"
>;

const SENSOR_SUBTYPE_CATALOG: Record<
  string,
  { readonly measurements: readonly SensorMeasurementDefinition[] }
> = {
  scd30: {
    measurements: [
      { key: "temperature", label: "Temperatura", isPrimaryVisual: true },
      { key: "humidity", label: "Humedad" },
      { key: "co2", label: "CO2" },
    ],
  },
  bme280: {
    measurements: [
      { key: "temperature", label: "Temperatura" },
      { key: "humidity", label: "Humedad", isPrimaryVisual: true },
      { key: "pressure", label: "Presión" },
    ],
  },
  capacitive: {
    measurements: [{ key: "humidity", label: "Humedad", isPrimaryVisual: true }],
  },
  onewire: {
    measurements: [{ key: "temperature", label: "Temperatura", isPrimaryVisual: true }],
  },
  modbus_th: {
    measurements: [
      { key: "temperature", label: "Temperatura", isPrimaryVisual: true },
      { key: "humidity", label: "Humedad" },
    ],
  },
  modbus_7in1: {
    measurements: [
      { key: "temperature", label: "Temperatura", isPrimaryVisual: true },
      { key: "humidity", label: "Humedad" },
    ],
  },
  hd38: {
    measurements: [{ key: "co2", label: "CO2", isPrimaryVisual: true }],
  },
};

export const UNIT_MAP: Record<MeasurementKey, string> = {
  temperature: "°C",
  humidity: "%",
  co2: "ppm",
  pressure: "hPa",
};

export const ACTUAL_KEY_MAP: Record<MeasurementKey, ActualMeasurementKey> = {
  temperature: "a_temperature",
  humidity: "a_humidity",
  co2: "a_co2",
  pressure: "a_pressure",
};

export const READING_KEY_MAP: Record<MeasurementKey, keyof SensorReading> = {
  temperature: "temperature",
  humidity: "humidity",
  co2: "co2",
  pressure: "pressure",
};

export function getSensorMeasurements(
  subtype: string
): readonly SensorMeasurementDefinition[] | null {
  return SENSOR_SUBTYPE_CATALOG[subtype]?.measurements ?? null;
}

export function getPrimaryVisualMeasurement(
  subtype: string
): SensorMeasurementDefinition | null {
  return (
    getSensorMeasurements(subtype)?.find((measurement) => measurement.isPrimaryVisual) ??
    null
  );
}
