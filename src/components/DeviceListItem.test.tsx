import React from "react";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { DeviceListItem } from "./DeviceListItem";
import type { Device, SensorRangeVisual } from "../types";

describe("DeviceListItem", () => {
  const sensor: Device = {
    id: "sensor-scd30-0",
    type: "sensor",
    name: "SCD30",
    subtype: "scd30",
    zones: ["Zona A"],
  };

  const visual: SensorRangeVisual = {
    label: "Temperatura",
    unit: "°C",
    min: 37.3,
    max: 37.7,
    current: 25.5,
  };

  it("renderiza el indicador cuando recibe un visual de sensor", () => {
    render(
      <DeviceListItem
        device={sensor}
        sensorVisual={visual}
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText("Temperatura")).toBeTruthy();
    expect(screen.getByText("37.3°C")).toBeTruthy();
    expect(screen.getByText("37.7°C")).toBeTruthy();
    expect(screen.getByText("25.5°C")).toBeTruthy();
  });

  it("no renderiza el indicador si no recibe visual", () => {
    render(<DeviceListItem device={sensor} onPress={jest.fn()} />);

    expect(screen.queryByText("Temperatura")).toBeNull();
  });

  it("mantiene el marker dentro del track en los extremos", () => {
    const { rerender } = render(
      <DeviceListItem
        device={sensor}
        sensorVisual={{ ...visual, current: visual.min }}
        onPress={jest.fn()}
      />
    );

    const markerRail = screen.getByTestId("sensor-range-marker-rail");
    const minMarker = screen.getByTestId("sensor-range-marker");

    expect(StyleSheet.flatten(markerRail.props.style)).toMatchObject({
      left: 6,
      right: 6,
    });
    expect(StyleSheet.flatten(minMarker.props.style)).toMatchObject({
      left: "0%",
      transform: [{ translateX: -6 }],
    });

    rerender(
      <DeviceListItem
        device={sensor}
        sensorVisual={{ ...visual, current: visual.max }}
        onPress={jest.fn()}
      />
    );

    const maxMarker = screen.getByTestId("sensor-range-marker");

    expect(StyleSheet.flatten(maxMarker.props.style)).toMatchObject({
      left: "100%",
      transform: [{ translateX: -6 }],
    });
  });
});
