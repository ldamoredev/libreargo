import type { SensorReading } from "../types";

/** Genera N lecturas mock con timestamps decrecientes (más reciente primero) */
export function generateMockReadings(count: number): readonly SensorReading[] {
  const now = Date.now();
  const interval = 30_000; // 30s entre lecturas

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(now - i * interval).toISOString();
    return {
      timestamp,
      temperature: 25.0 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5,
      humidity: 60.0 + Math.cos(i * 0.2) * 5 + Math.random() * 1.0,
      co2: 450 + Math.sin(i * 0.1) * 50 + Math.random() * 20,
      pressure: 1013.0 + Math.random() * 2,
    };
  });
}

export const mockReadings: readonly SensorReading[] = generateMockReadings(20);
