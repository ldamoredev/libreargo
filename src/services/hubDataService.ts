import {
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
import { getHubApiClient } from "./hubApi/backend";
export {
  InvalidHubConfigError,
  validateHubConfig,
} from "./hubApi/validation";

/**
 * Servicio de datos del hub.
 * Parte del acceso ya delega al backend seleccionado; alarms,
 * recommendations, ping y validación siguen usando el comportamiento local.
 */

const simulateDelay = (ms = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function getConfig(_hubIp: string): Promise<HubConfig> {
  return getHubApiClient().getConfig(_hubIp);
}

export async function getActual(hubIp: string): Promise<SensorData> {
  return getHubApiClient().getActual(hubIp);
}

export async function getRelays(
  hubIp: string
): Promise<readonly RelayState[]> {
  return getHubApiClient().getRelays(hubIp);
}

export async function getAlarms(_hubIp: string): Promise<readonly Alarm[]> {
  await simulateDelay();
  return mockAlarms;
}

export async function toggleRelay(
  hubIp: string,
  addr: number,
  ch: number
): Promise<string> {
  return getHubApiClient().toggleRelay(hubIp, addr, ch);
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
