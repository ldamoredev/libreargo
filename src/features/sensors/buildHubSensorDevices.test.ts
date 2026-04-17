import { buildHubSensorDevices } from "./buildHubSensorDevices";
import type { HubConfig } from "../../types";

const config: HubConfig = {
  incubator_name: "Hub Demo",
  hash: "AABBCCDDEEFF",
  min_temperature: 37.3,
  max_temperature: 37.7,
  min_hum: 55,
  max_hum: 65,
  sensors: [
    {
      type: "bme280",
      enabled: true,
      config: { measurementKey: "humidity" },
      zones: ["Zona A"],
    },
    {
      type: "onewire",
      enabled: true,
      config: {},
      zones: ["Zona B"],
    },
  ],
  relays: [],
};

describe("buildHubSensorDevices", () => {
  it("crea sensores visibles de un único tipo a partir del measurementKey explícito", () => {
    expect(buildHubSensorDevices(config)).toEqual([
      expect.objectContaining({
        id: "sensor-bme280-0",
        name: "Humedad",
        subtype: "bme280",
        sensorType: "humidity",
        zones: ["Zona A"],
      }),
      expect.objectContaining({
        id: "sensor-onewire-1",
        name: "Temperatura",
        subtype: "onewire",
        sensorType: "temperature",
        zones: ["Zona B"],
      }),
    ]);
  });
});
