import { COLORS } from "../constants";

export type SemaforoState = "ok" | "warn" | "bad";

export interface SemaforoResult {
  readonly state: SemaforoState;
  readonly bg: string;
  readonly fg: string;
}

const RESULT_OK: SemaforoResult = {
  state: "ok",
  bg: COLORS.successSoft,
  fg: COLORS.success,
};
const RESULT_WARN: SemaforoResult = {
  state: "warn",
  bg: COLORS.warningSoft,
  fg: COLORS.warning,
};
const RESULT_BAD: SemaforoResult = {
  state: "bad",
  bg: COLORS.errorSoft,
  fg: COLORS.error,
};

/**
 * Maps a numeric reading + range to a semaphore (traffic-light) state.
 *
 * - **bad** (red): value is outside [min, max]
 * - **warn** (amber): value is within 10% of either edge of the range
 * - **ok** (green): value is comfortably inside the range
 *
 * Designed for end users with low digital literacy: the color/icon is the
 * primary signal, and exact numeric thresholds matter less than the band.
 */
export function semaforo(
  value: number | null | undefined,
  min: number,
  max: number
): SemaforoResult {
  if (value == null || !Number.isFinite(value)) {
    return RESULT_OK;
  }
  if (max <= min) {
    return RESULT_OK;
  }

  if (value < min || value > max) {
    return RESULT_BAD;
  }

  const range = max - min;
  const buffer = range * 0.1;
  if (value < min + buffer || value > max - buffer) {
    return RESULT_WARN;
  }

  return RESULT_OK;
}
