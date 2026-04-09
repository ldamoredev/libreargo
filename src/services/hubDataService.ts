import {
  mockConfig,
  mockActual,
  mockRelays,
  mockAlarms,
  mockRecommendations,
} from "../mocks";
import type {
  HubConfig,
  SensorData,
  RelayState,
  Alarm,
  Recommendation,
} from "../types";

/**
 * Servicio de datos del hub.
 * Actualmente retorna mocks. Cuando se conecte al hub real,
 * solo hay que reemplazar las implementaciones por fetch HTTP.
 */

const simulateDelay = (ms = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function getConfig(_hubIp: string): Promise<HubConfig> {
  await simulateDelay();
  return mockConfig;
}

export async function getActual(_hubIp: string): Promise<SensorData> {
  await simulateDelay();
  return mockActual;
}

export async function getRelays(_hubIp: string): Promise<readonly RelayState[]> {
  await simulateDelay();
  return mockRelays;
}

export async function getAlarms(_hubIp: string): Promise<readonly Alarm[]> {
  await simulateDelay();
  return mockAlarms;
}

export async function toggleRelay(
  _hubIp: string,
  _addr: number,
  _ch: number
): Promise<string> {
  await simulateDelay(500);
  return "OK";
}

export async function getRecommendations(): Promise<readonly Recommendation[]> {
  await simulateDelay();
  return [...mockRecommendations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

/** Ping al hub para verificar conectividad */
export async function pingHub(_hubIp: string): Promise<boolean> {
  await simulateDelay(200);
  // Mock: siempre conectado para el primer hub
  return true;
}
