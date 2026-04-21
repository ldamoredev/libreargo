import { mockActual } from "../../mocks/actual";
import { mockConfig } from "../../mocks/config";
import { mockRelays } from "../../mocks/relays";
import { HubApiInvalidResponseError } from "./errors";
import {
  mapConfigurationResponse,
  mapRelayListResponse,
  mapSensorDataResponse,
  mapToggleRelayResponse,
} from "./adapters";

describe("hubApi adapters", () => {
  it("maps configuration responses to HubConfig", () => {
    expect(mapConfigurationResponse(mockConfig)).toEqual(mockConfig);
  });

  it("deep-clones nested configuration values", () => {
    const payload = {
      ...mockConfig,
      sensors: [
        {
          type: "scd30",
          enabled: true,
          config: {
            calibration: {
              offsets: [1, 2, 3],
            },
          },
        },
      ],
      relays: [
        {
          type: "relay_2ch",
          enabled: true,
          config: { address: 1, alias: "Ventilador" },
        },
      ],
    };

    const result = mapConfigurationResponse(payload);
    (((result.sensors[0].config as { calibration: { offsets: number[] } }).calibration)
      .offsets[0] = 99);

    expect(
      ((payload.sensors[0].config as { calibration: { offsets: number[] } }).calibration)
        .offsets[0]
    ).toBe(1);
  });

  it("rejects invalid configuration responses", () => {
    expect(() => mapConfigurationResponse({ hash: "short" })).toThrow(
      HubApiInvalidResponseError
    );
  });

  it("rejects semantically invalid configuration responses", () => {
    expect(() =>
      mapConfigurationResponse({
        ...mockConfig,
        min_temperature: 40,
        max_temperature: 30,
      })
    ).toThrow(HubApiInvalidResponseError);
  });

  it("maps sensor data responses to SensorData", () => {
    expect(mapSensorDataResponse(mockActual)).toEqual(mockActual);
  });

  it("maps relay list responses to RelayState arrays", () => {
    expect(mapRelayListResponse(mockRelays)).toEqual(mockRelays);
  });

  it("maps toggle responses to strings", () => {
    expect(mapToggleRelayResponse("OK")).toBe("OK");
  });

  it("rejects invalid sensor data responses", () => {
    expect(() => mapSensorDataResponse(null)).toThrow(
      HubApiInvalidResponseError
    );
  });

  it("rejects sensor data responses with unsupported wifi status", () => {
    expect(() =>
      mapSensorDataResponse({
        ...mockActual,
        wifi_status: "ok",
      })
    ).toThrow(HubApiInvalidResponseError);
  });

  it("rejects invalid relay list responses", () => {
    expect(() => mapRelayListResponse({})).toThrow(
      HubApiInvalidResponseError
    );
  });

  it("rejects invalid toggle responses", () => {
    expect(() => mapToggleRelayResponse(42)).toThrow(
      HubApiInvalidResponseError
    );
  });
});
