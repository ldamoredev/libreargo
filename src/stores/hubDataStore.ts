import { create } from "zustand";
import type { HubConfig, SensorData, RelayState, Alarm, Device } from "../types";
import { getConfig, getActual, getRelays, getAlarms } from "../services/hubDataService";
import { buildHubSensorDevices } from "../features/sensors/buildHubSensorDevices";

interface HubDataState {
  readonly config: HubConfig | null;
  readonly actual: SensorData | null;
  readonly relays: readonly RelayState[];
  readonly alarms: readonly Alarm[];
  readonly devices: readonly Device[];
  readonly loading: boolean;
  readonly error: string | null;
}

interface HubDataActions {
  readonly loadHubData: (hubIp: string) => Promise<void>;
  readonly clearData: () => void;
}

function buildDevices(
  config: HubConfig,
  relays: readonly RelayState[]
): readonly Device[] {
  const sensorDevices = buildHubSensorDevices(config);

  const relayDevices: Device[] = relays.map((r) => ({
    id: `relay-${r.address}`,
    type: "actuator" as const,
    name: r.alias,
    subtype: r.type,
    zones: r.zones ?? [],
    relayAddress: r.address,
  }));

  return [...sensorDevices, ...relayDevices];
}

export const useHubDataStore = create<HubDataState & HubDataActions>(
  (set) => ({
    config: null,
    actual: null,
    relays: [],
    alarms: [],
    devices: [],
    loading: false,
    error: null,

    loadHubData: async (hubIp: string) => {
      set({ loading: true, error: null });
      try {
        const [config, actual, relays, alarms] = await Promise.all([
          getConfig(hubIp),
          getActual(hubIp),
          getRelays(hubIp),
          getAlarms(hubIp),
        ]);
        const devices = buildDevices(config, relays);
        set({ config, actual, relays, alarms, devices, loading: false });
      } catch {
        set({ error: "No se pudieron cargar los datos del hub", loading: false });
      }
    },

    clearData: () =>
      set({
        config: null,
        actual: null,
        relays: [],
        alarms: [],
        devices: [],
        error: null,
      }),
  })
);
