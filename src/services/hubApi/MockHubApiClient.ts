import { mockActual } from "../../mocks/actual";
import { mockConfig } from "../../mocks/config";
import { mockRelays } from "../../mocks/relays";
import type { HubConfig, RelayState, SensorData } from "../../types";
import type { HubApiClient } from "./HubApiClient";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const cloneMockConfig = (): HubConfig => ({
  ...mockConfig,
  sensors: mockConfig.sensors.map((sensor) => ({
    ...sensor,
    config: { ...sensor.config },
    zones: sensor.zones ? [...sensor.zones] : undefined,
  })),
  relays: mockConfig.relays.map((relay) => ({
    ...relay,
    config: { ...relay.config },
  })),
});

const cloneMockActual = (): SensorData => ({
  ...mockActual,
  errors: {
    temperature: [...mockActual.errors.temperature],
    humidity: [...mockActual.errors.humidity],
    sensors: [...mockActual.errors.sensors],
    wifi: [...mockActual.errors.wifi],
    rotation: [...mockActual.errors.rotation],
  },
});

const cloneMockRelays = (): readonly RelayState[] =>
  mockRelays.map((relay) => ({
    ...relay,
    state: [relay.state[0], relay.state[1]] as const,
    input_state: [relay.input_state[0], relay.input_state[1]] as const,
    zones: relay.zones ? [...relay.zones] : undefined,
  }));

export function createMockHubApiClient(): HubApiClient {
  return {
    async getConfig() {
      await delay(120);
      return cloneMockConfig();
    },
    async getActual() {
      await delay(120);
      return cloneMockActual();
    },
    async getRelays() {
      await delay(120);
      return cloneMockRelays();
    },
    async toggleRelay() {
      await delay(80);
      return "OK";
    },
  };
}
