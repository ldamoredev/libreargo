import type { Hub } from "../../types";
import { getHubNotifyTopic } from "./topic";

function makeHub(overrides: Partial<Hub>): Hub {
  return {
    hash: "F024F90C58F8",
    name: "Hub Demo",
    ip: "192.168.4.1",
    status: "conectado",
    addedAt: "2026-06-18T12:00:00.000Z",
    ...overrides,
  };
}

describe("getHubNotifyTopic", () => {
  it("uses incubator_name when it already matches the ntfy topic", () => {
    expect(
      getHubNotifyTopic(makeHub({ name: "moni-f024f90c58f8" }))
    ).toBe("moni-f024f90c58f8");
  });

  it("falls back to moni-{hash} for human-readable hub names", () => {
    expect(getHubNotifyTopic(makeHub({ name: "Invernadero Norte" }))).toBe(
      "moni-f024f90c58f8"
    );
  });
});
