import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { CropsScreen } from "./CropsScreen";
import { useCropStore } from "../stores/cropStore";

describe("CropsScreen", () => {
  beforeEach(() => {
    useCropStore.setState({
      crops: [
        {
          id: "crop-1",
          name: "Tomate actual",
          startDate: "2026-04-01T00:00:00.000Z",
          period: 30,
          harvestDate: "2026-04-30T00:00:00.000Z",
          zones: ["Zona A"],
        },
        {
          id: "crop-3",
          name: "Tomate de hoy",
          startDate: "2026-04-10T00:00:00.000Z",
          period: 7,
          harvestDate: "2026-04-17T00:00:00.000Z",
          zones: ["Zona C"],
        },
        {
          id: "crop-2",
          name: "Lechuga cosechada",
          startDate: "2026-03-01T00:00:00.000Z",
          period: 15,
          harvestDate: "2026-03-16T00:00:00.000Z",
          zones: ["Zona B"],
        },
      ],
    });

    jest.useFakeTimers().setSystemTime(new Date("2026-04-17T00:30:00-03:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("muestra todos los cultivos por defecto y atenúa los ya cosechados", () => {
    render(<CropsScreen />);

    expect(screen.getByText("Tomate actual")).toBeTruthy();
    expect(screen.getByText("Lechuga cosechada")).toBeTruthy();
    expect(screen.getByTestId("crop-card-crop-2")).toHaveStyle({
      opacity: 0.55,
    });
  });

  it("filtra a sólo cultivos actuales cuando se selecciona Actuales", () => {
    render(<CropsScreen />);

    fireEvent.press(screen.getByText("Actuales"));

    expect(screen.getByText("Tomate actual")).toBeTruthy();
    expect(screen.getByText("Tomate de hoy")).toBeTruthy();
    expect(screen.queryByText("Lechuga cosechada")).toBeNull();
  });
});
