import { semaforo } from "./semaforo";

describe("semaforo", () => {
  it("returns ok when value is centered in range", () => {
    expect(semaforo(50, 0, 100).state).toBe("ok");
  });

  it("returns bad when value is below min", () => {
    expect(semaforo(-1, 0, 100).state).toBe("bad");
  });

  it("returns bad when value is above max", () => {
    expect(semaforo(101, 0, 100).state).toBe("bad");
  });

  it("returns warn when value is within 10% of lower edge", () => {
    // range = 100, buffer = 10, so [0, 10) is warn (excluding min itself)
    expect(semaforo(5, 0, 100).state).toBe("warn");
  });

  it("returns warn when value is within 10% of upper edge", () => {
    expect(semaforo(95, 0, 100).state).toBe("warn");
  });

  it("returns ok for null/undefined value", () => {
    expect(semaforo(null, 0, 100).state).toBe("ok");
    expect(semaforo(undefined, 0, 100).state).toBe("ok");
  });

  it("returns ok for invalid range", () => {
    expect(semaforo(5, 10, 10).state).toBe("ok");
    expect(semaforo(5, 20, 10).state).toBe("ok");
  });

  it("returns ok for non-finite value", () => {
    expect(semaforo(Number.NaN, 0, 100).state).toBe("ok");
  });
});
