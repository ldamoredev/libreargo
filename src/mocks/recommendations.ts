import type { Recommendation } from "../types";

export const mockRecommendations: readonly Recommendation[] = [
  {
    id: "rec-001",
    title: "Riego matutino",
    content:
      "Se recomienda regar entre las 6:00 y 8:00 AM para reducir la evaporación y mejorar la absorción de agua por las raíces.",
    date: "2026-03-30T06:00:00Z",
  },
  {
    id: "rec-002",
    title: "Control de ventilación",
    content:
      "Con temperaturas superiores a 35°C, activar ventilación forzada para evitar estrés térmico en los cultivos.",
    date: "2026-03-29T12:00:00Z",
  },
  {
    id: "rec-003",
    title: "Monitoreo de CO2",
    content:
      "Los niveles de CO2 están por encima de 1000 ppm. Considere aumentar la ventilación para mantener niveles óptimos entre 400-800 ppm.",
    date: "2026-03-28T15:00:00Z",
  },
  {
    id: "rec-004",
    title: "Fertilización programada",
    content:
      "Los niveles de nitrógeno en la zona 2 están bajos. Se recomienda aplicar fertilizante nitrogenado en las próximas 48 horas.",
    date: "2026-03-27T09:00:00Z",
  },
  {
    id: "rec-005",
    title: "Control de humedad nocturna",
    content:
      "La humedad relativa nocturna supera el 85%. Considere abrir las ventilas para reducir el riesgo de enfermedades fúngicas.",
    date: "2026-03-26T22:00:00Z",
  },
  {
    id: "rec-006",
    title: "Revisión de sensores",
    content:
      "Dos sensores del invernadero reportaron errores intermitentes. Programe una revisión física del cableado y conexiones.",
    date: "2026-03-25T11:00:00Z",
  },
];
