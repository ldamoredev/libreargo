import type { HubConfig } from "../types";

export const mockConfig: HubConfig = {
  incubator_name: "moni-AABBCCDD",
  hash: "AABBCCDDEEFF",
  min_temperature: 37.3,
  max_temperature: 37.7,
  min_hum: 55,
  max_hum: 65,
  sensors: [
    { type: "scd30", enabled: true, config: {}, zones: ["Zona A"] },
    { type: "bme280", enabled: true, config: {}, zones: ["Zona A", "Zona B"] },
    { type: "capacitive", enabled: false, config: {} },
  ],
  relays: [
    { type: "relay_2ch", enabled: true, config: { address: 1, alias: "Ventilador" } },
    { type: "relay_2ch", enabled: true, config: { address: 2, alias: "Bomba de riego" } },
  ],
};
