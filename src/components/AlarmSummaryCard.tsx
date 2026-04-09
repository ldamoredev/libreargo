import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { Alarm } from "../types";

const UNIT_MAP: Record<string, string> = {
  temperature: "°C",
  humidity: "%",
  co2: "ppm",
  pressure: "hPa",
};

const LABEL_MAP: Record<string, string> = {
  temperature: "Temperatura",
  humidity: "Humedad",
  co2: "CO2",
  pressure: "Presión",
};

interface AlarmSummaryCardProps {
  readonly alarms: readonly Alarm[];
  readonly onPress: () => void;
}

export function AlarmSummaryCard({ alarms, onPress }: AlarmSummaryCardProps) {
  const activeAlarms = alarms.filter((a) => a.status === "active");
  const count = activeAlarms.length;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarmas</Text>
        {count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>

      {count === 0 ? (
        <Text style={styles.noAlarms}>Sin alarmas activas</Text>
      ) : (
        activeAlarms.slice(0, 3).map((alarm) => (
          <View key={alarm.id} style={styles.alarmRow}>
            <View style={styles.dot} />
            <Text style={styles.alarmText} numberOfLines={1}>
              {LABEL_MAP[alarm.dataType] ?? alarm.dataType}:{" "}
              {alarm.alertValue}
              {UNIT_MAP[alarm.dataType] ?? ""}
            </Text>
            <Text style={styles.alarmZone} numberOfLines={1}>
              {alarm.zones.join(", ")}
            </Text>
          </View>
        ))
      )}

      {count > 3 && (
        <Text style={styles.more}>+{count - 3} más</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  countBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.surface,
  },
  noAlarms: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  alarmRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    marginRight: 8,
  },
  alarmText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  alarmZone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  more: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 6,
    fontWeight: "500",
  },
});
