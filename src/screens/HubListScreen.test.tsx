import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { HubListScreen } from "./HubListScreen";
import { useHubStore } from "../stores/hubStore";
import type { RootStackParamList } from "../navigation/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "HubList">;

function makeProps(): Props {
  return {
    navigation: { navigate: jest.fn() } as unknown as Props["navigation"],
    route: { key: "HubList", name: "HubList" } as Props["route"],
  };
}

describe("HubListScreen", () => {
  beforeEach(() => {
    useHubStore.setState({
      hubs: [
        {
          hash: "AABBCCDDEEFF",
          name: "moni-AABBCCDD",
          ip: "192.168.4.1",
          status: "conectado",
          addedAt: "2026-03-15T08:00:00Z",
        },
      ],
      connectionMode: "directo",
      selectedHubHash: null,
    });
  });

  it("mantiene visible la guía de conexión aunque ya existan hubs", () => {
    render(<HubListScreen {...makeProps()} />);

    expect(screen.getByText("Cómo conectar un hub")).toBeTruthy();
    expect(
      screen.getByText(/Conectate al Wi-Fi del hub/i)
    ).toBeTruthy();
  });

  it("abre una ayuda con la diferencia entre Directo y Online", () => {
    render(<HubListScreen {...makeProps()} />);

    fireEvent.press(
      screen.getByLabelText("Información sobre modos de conexión")
    );

    expect(screen.getByText("Modo Directo")).toBeTruthy();
    expect(screen.getByText("Modo Online")).toBeTruthy();
    expect(
      screen.getByText(
        "Conexión al Wi-Fi del hub, sin internet. Se usa para dar de alta el hub y operar localmente."
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Conexión por internet para acceder indirectamente a hubs que estén reportando datos."
      )
    ).toBeTruthy();
  });
});
