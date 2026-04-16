import { getSensorRangeVisual } from "./getSensorRangeVisual";
import { getPrimaryVisualMeasurement } from "../features/sensors/sensorMeasurementCatalog";
import { mockConfig } from "../mocks/config";
import { mockActual } from "../mocks/actual";
import type { Device } from "../types";

describe("getSensorRangeVisual", () => {
  it("devuelve visual de temperatura para un sensor scd30", () => {
    const device: Device = {
      id: "sensor-scd30-0",
      type: "sensor",
      name: "SCD30",
      subtype: "scd30",
      zones: ["Zona A"],
    };

    expect(getSensorRangeVisual(device, mockConfig, mockActual)).toEqual({
      label: "Temperatura",
      unit: "°C",
      min: 37.3,
      max: 37.7,
      current: 25.5,
    });
  });

  it("devuelve visual de humedad para un sensor bme280", () => {
    const device: Device = {
      id: "sensor-bme280-0",
      type: "sensor",
      name: "BME280",
      subtype: "bme280",
      zones: ["Zona A"],
    };

    expect(getSensorRangeVisual(device, mockConfig, mockActual)).toEqual({
      label: "Humedad",
      unit: "%",
      min: 55,
      max: 65,
      current: 60,
    });
  });

  it("devuelve null para actuadores", () => {
    const device: Device = {
      id: "relay-1",
      type: "actuator",
      name: "Ventilador",
      subtype: "relay_2ch",
      zones: ["Zona A"],
      relayAddress: 1,
    };

    expect(getSensorRangeVisual(device, mockConfig, mockActual)).toBeNull();
  });

  it("devuelve null cuando la metrica principal no tiene rango configurado", () => {
    const device: Device = {
      id: "sensor-hd38-0",
      type: "sensor",
      name: "HD38",
      subtype: "hd38",
      zones: [],
    };

    expect(getSensorRangeVisual(device, mockConfig, mockActual)).toBeNull();
  });

  it("obtiene la medicion visual primaria desde el mismo catalogo del subtipo", () => {
    expect(getPrimaryVisualMeasurement("bme280")).toEqual({
      key: "humidity",
      label: "Humedad",
      isPrimaryVisual: true,
    });
  });
});
