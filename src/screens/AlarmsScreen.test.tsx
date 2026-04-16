import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AlarmsScreen } from "./AlarmsScreen";
import { useHubDataStore } from "../stores/hubDataStore";
import type { RootStackParamList } from "../navigation/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Alarms">;

function makeProps(): Props {
  return {
    navigation: { navigate: jest.fn(), goBack: jest.fn() } as unknown as Props["navigation"],
    route: {
      key: "Alarms",
      name: "Alarms",
      params: { hubHash: "AABBCCDDEEFF" },
    } as Props["route"],
  };
}

describe("AlarmsScreen", () => {
  beforeEach(() => {
    useHubDataStore.setState({
      config: null,
      actual: null,
      relays: [],
      devices: [],
      loading: false,
      error: null,
      alarms: [
        {
          id: "alarm-001",
          timestamp: "2026-03-30T10:15:00Z",
          dataType: "temperature",
          alertValue: 38.5,
          currentValue: 37.8,
          zones: ["Zona A"],
          status: "active",
        },
      ],
    });
  });

  it("muestra sólo Reconocer para alarmas activas", () => {
    render(<AlarmsScreen {...makeProps()} />);

    expect(screen.queryByText("Posponer")).toBeNull();
    expect(screen.getByText("Reconocer")).toBeTruthy();
  });

  it("permite reconocer una alarma", () => {
    render(<AlarmsScreen {...makeProps()} />);

    fireEvent.press(screen.getByText("Reconocer"));

    expect(screen.getByText("Reconocida")).toBeTruthy();
  });
});
