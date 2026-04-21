import React from "react";
import { render, screen } from "@testing-library/react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SensorDetailScreen } from "./SensorDetailScreen";
import { useHubDataStore } from "../stores/hubDataStore";
import type { HubConfig, SensorData } from "../types";
import type { RootStackParamList } from "../navigation/types";

jest.mock("../mocks", () => ({
  mockReadings: [
    {
      timestamp: "2026-04-17T13:00:00.000Z",
      temperature: 25.2,
      humidity: 70,
      co2: 500,
      pressure: 1013,
    },
    {
      timestamp: "2026-04-17T12:59:30.000Z",
      temperature: 25.1,
      humidity: 62,
      co2: 495,
      pressure: 1012,
    },
  ],
}));

type Props = NativeStackScreenProps<RootStackParamList, "SensorDetail">;

function makeProps(sensorId: string): Props {
  return {
    navigation: { goBack: jest.fn() } as unknown as Props["navigation"],
    route: {
      key: "SensorDetail",
      name: "SensorDetail",
      params: { hubHash: "hub-1", sensorId },
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
    wifi_status: "connected",
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

  it("resuelve el dispositivo exacto por sensorId y usa sus zonas y metrica", () => {
    useHubDataStore.setState({
      config,
      actual,
      relays: [],
      alarms: [],
      devices: [
        {
          id: "sensor-bme280-0",
          type: "sensor",
          name: "Humedad",
          subtype: "bme280",
          sensorType: "humidity",
          zones: ["Zona A"],
        },
        {
          id: "sensor-bme280-1",
          type: "sensor",
          name: "Temperatura",
          subtype: "bme280",
          sensorType: "temperature",
          zones: ["Zona B"],
        },
      ],
      loading: false,
      error: null,
      loadHubData: jest.fn(),
      clearData: jest.fn(),
    });

    render(<SensorDetailScreen {...makeProps("sensor-bme280-1")} />);

    expect(screen.getByText("Zona B")).toBeTruthy();
    expect(screen.getByText("25.5")).toBeTruthy();
    expect(screen.queryByText("Zona A")).toBeNull();
  });

  it("muestra un estado explicito cuando el subtipo no esta soportado", () => {
    render(<SensorDetailScreen {...makeProps("sensor-mystery_sensor-0")} />);

    expect(screen.getByText("MYSTERY_SENSOR")).toBeTruthy();
    expect(screen.getByText("Sensor no soportado")).toBeTruthy();
    expect(screen.queryByText("Temperatura")).toBeNull();
    expect(screen.queryByText("Histórico reciente")).toBeNull();
  });

  it("muestra una sola medición con su rango visible", () => {
    useHubDataStore.setState({
      config,
      actual,
      relays: [],
      alarms: [],
      devices: [
        {
          id: "sensor-bme280-0",
          type: "sensor",
          name: "Sensor BME280",
          subtype: "bme280",
          sensorType: "humidity",
          zones: ["Zona A"],
        },
      ],
      loading: false,
      error: null,
      loadHubData: jest.fn(),
      clearData: jest.fn(),
    });

    render(<SensorDetailScreen {...makeProps("sensor-bme280-0")} />);

    expect(screen.getByText("Humedad")).toBeTruthy();
    expect(screen.getByText("Mínimo")).toBeTruthy();
    expect(screen.getByText("Máximo")).toBeTruthy();
    expect(screen.queryByText("Temperatura")).toBeNull();
    expect(screen.queryByText("Presión")).toBeNull();
  });

  it("resalta filas del histórico cuando caen fuera de rango", () => {
    useHubDataStore.setState({
      config,
      actual,
      relays: [],
      alarms: [],
      devices: [
        {
          id: "sensor-bme280-0",
          type: "sensor",
          name: "Sensor BME280",
          subtype: "bme280",
          sensorType: "humidity",
          zones: ["Zona A"],
        },
      ],
      loading: false,
      error: null,
      loadHubData: jest.fn(),
      clearData: jest.fn(),
    });

    render(<SensorDetailScreen {...makeProps("sensor-bme280-0")} />);

    expect(screen.getByTestId("history-row-out-of-range-0")).toHaveStyle({
      backgroundColor: "#FDECEC",
    });
  });

  it("muestra el detalle cuando el sensor es soportado pero no tiene rango configurado", () => {
    useHubDataStore.setState({
      config,
      actual,
      relays: [],
      alarms: [],
      devices: [
        {
          id: "sensor-hd38-0",
          type: "sensor",
          name: "Sensor HD38",
          subtype: "hd38",
          sensorType: "co2",
          zones: ["Zona A"],
        },
      ],
      loading: false,
      error: null,
      loadHubData: jest.fn(),
      clearData: jest.fn(),
    });

    render(<SensorDetailScreen {...makeProps("sensor-hd38-0")} />);

    expect(screen.getByText("CO2")).toBeTruthy();
    expect(screen.getByText("Mínimo")).toBeTruthy();
    expect(screen.getByText("Máximo")).toBeTruthy();
    expect(screen.getAllByText("—")).toHaveLength(2);
    expect(screen.queryByTestId("history-row-out-of-range-0")).toBeNull();
    expect(screen.getByTestId("history-row-0")).toBeTruthy();
  });
});
