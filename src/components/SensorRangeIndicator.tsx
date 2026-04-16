import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { SensorRangeVisual } from "../types";

const MARKER_SIZE = 12;
const MARKER_RADIUS = MARKER_SIZE / 2;

interface SensorRangeIndicatorProps {
  readonly visual: SensorRangeVisual;
}

export function SensorRangeIndicator({
  visual,
}: SensorRangeIndicatorProps) {
  const progress = Math.min(
    100,
    Math.max(
      0,
      ((visual.current - visual.min) / (visual.max - visual.min)) * 100
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{visual.label}</Text>
        <Text style={styles.current}>
          {visual.current.toFixed(1)}
          {visual.unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View testID="sensor-range-marker-rail" style={styles.markerRail}>
          <View
            testID="sensor-range-marker"
            style={[styles.marker, { left: `${progress}%` }]}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.bound}>
          {visual.min.toFixed(1)}
          {visual.unit}
        </Text>
        <Text style={styles.bound}>
          {visual.max.toFixed(1)}
          {visual.unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  current: { fontSize: 14, color: COLORS.text, fontWeight: "700" },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#DDE8DD",
    position: "relative",
  },
  markerRail: {
    ...StyleSheet.absoluteFillObject,
    left: MARKER_RADIUS,
    right: MARKER_RADIUS,
  },
  marker: {
    position: "absolute",
    top: -2,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_RADIUS,
    backgroundColor: COLORS.primary,
    transform: [{ translateX: -MARKER_RADIUS }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  bound: { fontSize: 12, color: COLORS.textSecondary },
});
