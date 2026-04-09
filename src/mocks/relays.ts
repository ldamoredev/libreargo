import type { RelayState } from "../types";

export const mockRelays: readonly RelayState[] = [
  {
    type: "relay_2ch",
    address: 1,
    alias: "Ventilador",
    active: true,
    state: [true, false],
    input_state: [true, false],
    zones: ["Zona A"],
  },
  {
    type: "relay_2ch",
    address: 2,
    alias: "Bomba de riego",
    active: true,
    state: [false, false],
    input_state: [false, false],
    zones: ["Zona B"],
  },
  {
    type: "relay_2ch",
    address: 3,
    alias: "Calefactor",
    active: false,
    state: [false, false],
    input_state: [false, false],
    zones: ["Zona A"],
  },
];
