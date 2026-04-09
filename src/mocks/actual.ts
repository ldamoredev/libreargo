import type { SensorData } from "../types";

export const mockActual: SensorData = {
  a_temperature: "25.50",
  a_humidity: "60.00",
  a_co2: "450.00",
  a_pressure: "1013.25",
  wifi_status: "connected",
  errors: {
    temperature: [],
    humidity: [],
    sensors: [],
    wifi: [],
    rotation: [],
  },
};

export const mockActualWithErrors: SensorData = {
  a_temperature: "38.50",
  a_humidity: "40.00",
  a_co2: "1200.00",
  a_pressure: "1013.25",
  wifi_status: "connected",
  errors: {
    temperature: ["SCD30 read timeout"],
    humidity: [],
    sensors: ["BME280 not responding"],
    wifi: [],
    rotation: [],
  },
};
