import type { SensorData, SensorReading } from "../../types";

export type MeasurementKey = "temperature" | "humidity" | "co2" | "pressure";
type ActualMeasurementKey = keyof Pick<
  SensorData,
  "a_temperature" | "a_humidity" | "a_co2" | "a_pressure"
>;

export const SENSOR_MEASUREMENTS: Record<
  string,
  readonly { key: MeasurementKey; label: string }[]
> = {
  scd30: [
    { key: "temperature", label: "Temperatura" },
    { key: "humidity", label: "Humedad" },
    { key: "co2", label: "CO2" },
  ],
  bme280: [
    { key: "temperature", label: "Temperatura" },
    { key: "humidity", label: "Humedad" },
    { key: "pressure", label: "Presión" },
  ],
  capacitive: [{ key: "humidity", label: "Humedad" }],
  onewire: [{ key: "temperature", label: "Temperatura" }],
  modbus_th: [
    { key: "temperature", label: "Temperatura" },
    { key: "humidity", label: "Humedad" },
  ],
  modbus_7in1: [
    { key: "temperature", label: "Temperatura" },
    { key: "humidity", label: "Humedad" },
  ],
  hd38: [{ key: "co2", label: "CO2" }],
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

export const PRIMARY_VISUAL_MEASUREMENT: Record<string, MeasurementKey> = {
  scd30: "temperature",
  bme280: "temperature",
  capacitive: "humidity",
  onewire: "temperature",
  modbus_th: "temperature",
  modbus_7in1: "temperature",
  hd38: "co2",
};
