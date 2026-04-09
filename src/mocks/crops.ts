import type { Crop } from "../types";

export const mockCrops: readonly Crop[] = [
  {
    id: "crop-001",
    name: "Tomate Cherry",
    startDate: "2026-03-01T00:00:00Z",
    period: 90,
    harvestDate: "2026-05-30T00:00:00Z",
    zones: ["Zona A"],
  },
  {
    id: "crop-002",
    name: "Lechuga Mantecosa",
    startDate: "2026-03-10T00:00:00Z",
    period: 60,
    harvestDate: "2026-05-09T00:00:00Z",
    zones: ["Zona B"],
  },
];
