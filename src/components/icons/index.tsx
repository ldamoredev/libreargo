import Svg, { Path, Circle, G } from "react-native-svg";
import { COLORS } from "../../constants";

export interface IconProps {
  readonly size?: number;
  readonly color?: string;
}

const STROKE_WIDTH = 2.6;

/**
 * LibreAgro pictogram set.
 *
 * All icons are bold-stroke SVGs sized to a 48x48 viewBox so they read clearly
 * at any size, indoors or in direct sunlight. They accept a `color` prop so a
 * single icon doubles as the semaphore status indicator.
 */

export function IcoTermometro({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 6c-3.3 0-6 2.7-6 6v17.5a9 9 0 1 0 12 0V12c0-3.3-2.7-6-6-6Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M24 14v18"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Circle cx="24" cy="36" r="5.5" fill={color} />
    </Svg>
  );
}

export function IcoGota({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 6c-6 8-12 14.5-12 22a12 12 0 0 0 24 0c0-7.5-6-14-12-22Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M18 28c0 3.3 2.7 6 6 6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        opacity={0.5}
      />
    </Svg>
  );
}

export function IcoBrote({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 30V18"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Path
        d="M24 22c-3-4-7-4-10-3 0 4 3 8 10 8"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M24 18c3-4 7-4 10-3 0 4-3 8-10 8"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M6 34h36"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Path
        d="M10 38h4M18 38h4M26 38h4M34 38h4"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        opacity={0.55}
      />
    </Svg>
  );
}

export function IcoSol({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="8" stroke={color} strokeWidth={STROKE_WIDTH} />
      <G stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round">
        <Path d="M24 6v4" />
        <Path d="M24 38v4" />
        <Path d="M6 24h4" />
        <Path d="M38 24h4" />
        <Path d="M11 11l3 3" />
        <Path d="M34 34l3 3" />
        <Path d="M37 11l-3 3" />
        <Path d="M14 34l-3 3" />
      </G>
    </Svg>
  );
}

export function IcoCO2({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M10 18h18a6 6 0 1 1 0 12H10"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 26h22a4 4 0 1 1 0 8H6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 12h10a3 3 0 1 1 0 6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoPresion({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="16" stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M24 14v10l7 4"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoVentilador({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="3" fill={color} />
      <Path
        d="M24 21c-6-4-13-3-13 3 0 4 5 6 9 4 4-2 4-5 4-7Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M27 24c4-6 3-13-3-13-4 0-6 5-4 9 2 4 5 4 7 4Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M24 27c6 4 13 3 13-3 0-4-5-6-9-4-4 2-4 5-4 7Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M21 24c-4 6-3 13 3 13 4 0 6-5 4-9-2-4-5-4-7-4Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoBomba({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M16 10h14l-4 6h-6l-4-6Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path d="M21 16v6h6v-6" stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M14 22h20v8l-10 10-10-10v-8Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M24 30v6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Path
        d="M20 32l4 4 4-4"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoCalefactor({ size = 72, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 6c2 6 8 9 8 16a8 8 0 1 1-16 0c0-4 2-6 4-9 1 2 2 3 4 3 0-4-2-6 0-10Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M24 24c1 3 3 4 3 7a3 3 0 1 1-6 0c0-2 1-3 2-4 0 1 1 1 1 1 0-1 0-2 0-4Z"
        fill={color}
      />
    </Svg>
  );
}

export function IcoCheck({ size = 56, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M10 25l10 10 18-22"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoAlerta({ size = 56, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 6l20 34H4L24 6Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M24 20v10"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Circle cx="24" cy="35" r="2.4" fill={color} />
    </Svg>
  );
}

export function IcoReloj({ size = 48, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="18" stroke={color} strokeWidth={4} />
      <Path
        d="M24 14v11l7 4"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoChevron({
  size = 28,
  color = "#9A9A9A",
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoBack({ size = 32, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M20 6L10 16l10 10"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoWifi({ size = 28, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 12c7-6 17-6 24 0"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M8 17c4.5-4 11.5-4 16 0"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M12 22c2.5-2 5.5-2 8 0"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Circle cx="16" cy="26" r="2" fill={color} />
    </Svg>
  );
}

export function IcoPlus({ size = 36, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 6v20M6 16h20"
        stroke={color}
        strokeWidth={3.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoPower({ size = 56, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 8v14"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <Path
        d="M13 17a14 14 0 1 0 22 0"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoCampana({ size = 36, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M7 23c2-2 3-4 3-8a6 6 0 1 1 12 0c0 4 1 6 3 8H7Z"
        stroke={color}
        strokeWidth={2.8}
        strokeLinejoin="round"
      />
      <Path
        d="M13 26a3 3 0 0 0 6 0"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoMenu({ size = 28, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M5 9h22M5 16h22M5 23h22"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoX({ size = 28, color = COLORS.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6L6 18"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoCalendario({ size = 48, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M8 14a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V14Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path d="M8 20h32" stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M16 6v8M32 6v8"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Circle cx="16" cy="28" r="2" fill={color} />
      <Circle cx="24" cy="28" r="2" fill={color} />
      <Circle cx="32" cy="28" r="2" fill={color} />
    </Svg>
  );
}

export function IcoIdea({ size = 56, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 6a12 12 0 0 0-7 21.7c1.5 1.1 2 2.5 2 4.3v2h10v-2c0-1.8.5-3.2 2-4.3A12 12 0 0 0 24 6Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M19 38h10M21 42h6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IcoCasa({ size = 28, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 15L16 5l12 10v13H4V15Z"
        stroke={color}
        strokeWidth={2.8}
        strokeLinejoin="round"
      />
      <Path
        d="M13 28v-7h6v7"
        stroke={color}
        strokeWidth={2.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IcoZona({ size = 24, color = COLORS.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="2.5" fill={color} />
    </Svg>
  );
}
