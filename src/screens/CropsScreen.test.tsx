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
          id: "crop-4",
          name: "Tomate futuro",
          startDate: "2026-04-18T00:00:00.000Z",
          period: 20,
          harvestDate: "2026-05-08T00:00:00.000Z",
          zones: ["Zona D"],
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

    jest.useFakeTimers().setSystemTime(new Date("2026-04-17T23:30:00-03:00"));
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
    expect(screen.queryByText("Tomate futuro")).toBeNull();
    expect(screen.queryByText("Lechuga cosechada")).toBeNull();
  });

  it("muestra el estado vacío de Actuales cuando no quedan cultivos vigentes", () => {
    useCropStore.setState({
      crops: [
        {
          id: "crop-expired",
          name: "Lechuga vieja",
          startDate: "2026-03-01T00:00:00.000Z",
          period: 15,
          harvestDate: "2026-03-16T00:00:00.000Z",
          zones: ["Zona B"],
        },
      ],
    });

    render(<CropsScreen />);

    fireEvent.press(screen.getByText("Actuales"));

    expect(screen.getByText("No hay cultivos en el período actual")).toBeTruthy();
    expect(
      screen.getByText("Cambiar a Todos para ver cultivos cosechados.")
    ).toBeTruthy();
    expect(screen.queryByText("Lechuga vieja")).toBeNull();
  });
});
