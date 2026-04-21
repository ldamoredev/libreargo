import type { HubApiClient } from "./HubApiClient";
import {
  mapConfigurationResponse,
  mapRelayListResponse,
  mapSensorDataResponse,
  mapToggleRelayResponse,
} from "./adapters";
import {
  HubApiInvalidResponseError,
  HubApiNetworkError,
  HubApiToggleError,
} from "./errors";

type HubResponse = {
  ok: boolean;
  status: number;
  headers: {
    get(name: string): string | null;
  };
  json(): Promise<unknown>;
  text(): Promise<string>;
};

export function createHttpHubApiClient(): HubApiClient {
  return {
    async getConfig(hubIp: string) {
      const response = await request(hubIp, "/config", { method: "GET" });
      return mapConfigurationResponse(await readBody(response));
    },
    async getActual(hubIp: string) {
      const response = await request(hubIp, "/actual", { method: "GET" });
      return mapSensorDataResponse(await readBody(response));
    },
    async getRelays(hubIp: string) {
      const response = await request(hubIp, "/api/relays", { method: "GET" });
      return mapRelayListResponse(await readBody(response));
    },
    async toggleRelay(hubIp: string, addr: number, ch: number) {
      const response = await request(
        hubIp,
        `/api/relay/toggle?addr=${addr}&ch=${ch}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new HubApiToggleError();
      }

      return mapToggleRelayResponse(await readBody(response));
    },
  };
}

async function request(
  hubIp: string,
  path: string,
  init?: RequestInit
): Promise<HubResponse> {
  try {
    const response = (await fetch(`http://${hubIp}${path}`, init)) as HubResponse;
    if (!response.ok && !isTogglePath(path)) {
      throw new HubApiNetworkError(`Hub request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error instanceof HubApiToggleError || error instanceof HubApiNetworkError) {
      throw error;
    }
    throw new HubApiNetworkError();
  }
}

async function readBody(response: HubResponse): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json") || contentType.includes("+json");

  try {
    return isJson ? await response.json() : await response.text();
  } catch {
    throw new HubApiInvalidResponseError();
  }
}

function isTogglePath(path: string): boolean {
  return path.startsWith("/api/relay/toggle");
}
