import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { DeviceListItem } from "./DeviceListItem";
import type { Device, RelayState, SensorRangeVisual } from "../types";

describe("DeviceListItem (icon-first redesign)", () => {
  const sensor: Device = {
    id: "sensor-scd30-0",
    type: "sensor",
    name: "SCD30",
    subtype: "scd30",
    sensorType: "temperature",
    zones: ["Zona A"],
  };

  const visual: SensorRangeVisual = {
    label: "Temperatura",
    unit: "°C",
    min: 18,
    max: 28,
    current: 25.5,
  };

  it("renders the value, unit, and range bounds for a sensor with visual", () => {
    render(
      <DeviceListItem
        device={sensor}
        sensorVisual={visual}
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText("25.5")).toBeTruthy();
    expect(screen.getByText("°C")).toBeTruthy();
    expect(screen.getByText("18°C")).toBeTruthy();
    expect(screen.getByText("28°C")).toBeTruthy();
  });

  it("does not render a range bar when no visual is provided", () => {
    render(<DeviceListItem device={sensor} onPress={jest.fn()} />);

    expect(screen.queryByTestId("sensor-range-marker")).toBeNull();
  });

  it("keeps the range marker inside the rail at min and max", () => {
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

  it("uses the red semaphore color when a sensor is out of range", () => {
    render(
      <DeviceListItem
        device={{
          id: "sensor-bme280-0",
          type: "sensor",
          name: "Humedad",
          subtype: "bme280",
          sensorType: "humidity",
          zones: ["Zona A"],
        }}
        sensorVisual={{
          label: "Humedad",
          unit: "%",
          min: 55,
          max: 65,
          current: 40,
        }}
        onPress={jest.fn()}
      />
    );

    const marker = screen.getByTestId("sensor-range-marker");
    expect(StyleSheet.flatten(marker.props.style)).toMatchObject({
      backgroundColor: "#C62828",
    });
  });

  it("renders ENCENDIDO / APAGADO for actuators based on relay state", () => {
    const onPress = jest.fn();
    const actuatorDevice: Device = {
      id: "relay-1",
      type: "actuator",
      name: "Bomba de riego",
      subtype: "relay_2ch",
      zones: ["Invernadero 1"],
      relayAddress: 1,
    };
    const onRelay: RelayState = {
      type: "relay_2ch",
      address: 1,
      alias: "Bomba",
      active: true,
      state: [true, false],
      input_state: [false, false],
    };

    render(
      <DeviceListItem
        device={actuatorDevice}
        relay={onRelay}
        onPress={onPress}
      />
    );

    expect(screen.getByText("ENCENDIDO")).toBeTruthy();
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledWith(actuatorDevice);
  });
});
