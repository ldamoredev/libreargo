import React from "react";
import { render, screen } from "@testing-library/react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SensorDetailScreen } from "./SensorDetailScreen";
import { useHubDataStore } from "../stores/hubDataStore";
import type { HubConfig, SensorData } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SensorDetail">;

function makeProps(sensorType: string): Props {
  return {
    navigation: { goBack: jest.fn() } as unknown as Props["navigation"],
    route: {
      key: "SensorDetail",
      name: "SensorDetail",
      params: { hubHash: "hub-1", sensorType },
    } as Props["route"],
  };
}

describe("SensorDetailScreen", () => {
  const config: HubConfig = {
    incubator_name: "Hub Demo",
    hash: "hub-1",
    min_temperature: 37.3,
    max_temperature: 37.7,
    min_hum: 55,
    max_hum: 65,
    sensors: [],
    relays: [],
  };

  const actual: SensorData = {
    a_temperature: "25.5",
    a_humidity: "60.0",
    a_co2: "500",
    a_pressure: "1013",
    wifi_status: "ok",
    errors: {
      temperature: [],
      humidity: [],
      sensors: [],
      wifi: [],
      rotation: [],
    },
  };

  beforeEach(() => {
    useHubDataStore.setState({
      config,
      actual,
      relays: [],
      alarms: [],
      devices: [],
      loading: false,
      error: null,
      loadHubData: jest.fn(),
      clearData: jest.fn(),
    });
  });

  it("muestra un estado explicito cuando el subtipo no esta soportado", () => {
    render(<SensorDetailScreen {...makeProps("mystery_sensor")} />);

    expect(screen.getByText("MYSTERY_SENSOR")).toBeTruthy();
    expect(screen.getByText("Sensor no soportado")).toBeTruthy();
    expect(screen.queryByText("Temperatura")).toBeNull();
    expect(screen.queryByText("Histórico reciente")).toBeNull();
  });
});
