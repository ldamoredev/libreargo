import { getMeasurementRange } from "./getMeasurementRange";
import type { HubConfig } from "../../types";

const config: HubConfig = {
  incubator_name: "Hub Demo",
  hash: "AABBCCDDEEFF",
  min_temperature: 37.3,
  max_temperature: 37.7,
  min_hum: 55,
  max_hum: 65,
  sensors: [],
  relays: [],
};

describe("getMeasurementRange", () => {
  it("resuelve el rango de temperatura desde la config", () => {
    expect(getMeasurementRange("temperature", config)).toEqual({
      min: 37.3,
      max: 37.7,
    });
  });

  it("resuelve el rango de humedad desde la config", () => {
    expect(getMeasurementRange("humidity", config)).toEqual({
      min: 55,
      max: 65,
    });
  });

  it("devuelve null para métricas sin rango configurado", () => {
    expect(getMeasurementRange("pressure", config)).toBeNull();
  });
});
