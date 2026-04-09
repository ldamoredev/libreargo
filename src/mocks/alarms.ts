import type { Alarm } from "../types";

export const mockAlarms: readonly Alarm[] = [
  {
    id: "alarm-001",
    timestamp: "2026-03-30T10:15:00Z",
    dataType: "temperature",
    alertValue: 38.5,
    currentValue: 37.8,
    zones: ["Zona A"],
    status: "active",
  },
  {
    id: "alarm-002",
    timestamp: "2026-03-30T09:45:00Z",
    dataType: "humidity",
    alertValue: 45.0,
    currentValue: 52.0,
    zones: ["Zona B"],
    status: "active",
  },
  {
    id: "alarm-003",
    timestamp: "2026-03-29T22:00:00Z",
    dataType: "co2",
    alertValue: 1500.0,
    currentValue: 1200.0,
    zones: ["Zona A", "Zona B"],
    status: "acknowledged",
  },
  {
    id: "alarm-004",
    timestamp: "2026-03-29T18:30:00Z",
    dataType: "temperature",
    alertValue: 36.0,
    currentValue: 36.5,
    zones: ["Zona A"],
    status: "postponed",
  },
];
