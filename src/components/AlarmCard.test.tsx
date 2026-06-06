import React from "react";
import { render, screen } from "@testing-library/react-native";
import { AlarmCard } from "./AlarmCard";
import type { Alarm } from "../types";

function makeAlarm(timestamp: string): Alarm {
  return {
    id: "a1",
    timestamp,
    dataType: "humidity",
    alertValue: 55,
    currentValue: 100,
    zones: [],
    status: "active",
    message: "[H] Humidity too low",
  };
}

describe("AlarmCard - formato de timestamp", () => {
  it("muestra '—' (no 'NaN/NaN NaN:NaN') con timestamp opaco del hub sin NTP", () => {
    render(
      <AlarmCard
        alarm={makeAlarm("88257000000000")}
        config={null}
        onAcknowledge={jest.fn()}
      />
    );
    expect(screen.queryByText(/NaN/)).toBeNull();
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("muestra '—' con timestamp vacío", () => {
    render(
      <AlarmCard
        alarm={makeAlarm("")}
        config={null}
        onAcknowledge={jest.fn()}
      />
    );
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("formatea una fecha ISO válida sin 'NaN' ni '—'", () => {
    render(
      <AlarmCard
        alarm={makeAlarm("2026-03-30T10:15:00Z")}
        config={null}
        onAcknowledge={jest.fn()}
      />
    );
    expect(screen.queryByText(/NaN/)).toBeNull();
    expect(screen.queryByText("—")).toBeNull();
  });
});
