import type { Hub } from "../types";

export const mockHubs: readonly Hub[] = [
  {
    hash: "AABBCCDDEEFF",
    name: "moni-AABBCCDD",
    ip: "192.168.4.1",
    status: "conectado",
    addedAt: "2026-03-15T08:00:00Z",
  },
  {
    hash: "112233445566",
    name: "moni-11223344",
    ip: "192.168.1.50",
    status: "desconectado",
    addedAt: "2026-03-20T10:00:00Z",
  },
  {
    hash: "FFEEDDCCBBAA",
    name: "moni-FFEEDDCC",
    ip: "192.168.1.51",
    status: "conectado",
    addedAt: "2026-03-25T14:30:00Z",
  },
];
