import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { Alarm, HubConfig } from "../types";
import { getMeasurementRange } from "../features/sensors/getMeasurementRange";

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

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  acknowledged: "Reconocida",
};

const STATUS_COLOR: Record<string, string> = {
  active: COLORS.error,
  acknowledged: COLORS.textSecondary,
};

interface AlarmCardProps {
  readonly alarm: Alarm;
  readonly config: HubConfig | null;
  readonly onAcknowledge: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AlarmCard({ alarm, config, onAcknowledge }: AlarmCardProps) {
  const unit = UNIT_MAP[alarm.dataType] ?? "";
  const label = LABEL_MAP[alarm.dataType] ?? alarm.dataType;
  const statusColor = STATUS_COLOR[alarm.status] ?? COLORS.textSecondary;
  const isActive = alarm.status === "active";
  const range = getMeasurementRange(alarm.dataType, config);
  const isCurrentOutOfRange =
    range !== null &&
    (alarm.currentValue < range.min || alarm.currentValue > range.max);

  return (
    <View style={[styles.container, !isActive && styles.containerInactive]}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={styles.date}>{formatDate(alarm.timestamp)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABEL[alarm.status] ?? alarm.status}
          </Text>
        </View>
      </View>

      <Text style={styles.type}>{label}</Text>

      <View style={styles.valuesRow}>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Alerta</Text>
          <Text style={[styles.value, { color: COLORS.error }]}>
            {alarm.alertValue}{unit}
          </Text>
        </View>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Actual</Text>
          <Text
            style={[styles.value, isCurrentOutOfRange && styles.valueOutOfRange]}
          >
            {alarm.currentValue}{unit}
          </Text>
        </View>
      </View>

      {range && (
        <View style={styles.rangeRow}>
          <View style={styles.valueBlock}>
            <Text style={styles.valueLabel}>Mínimo</Text>
            <Text style={styles.rangeValue}>{range.min.toFixed(1)}{unit}</Text>
          </View>
          <View style={styles.valueBlock}>
            <Text style={styles.valueLabel}>Máximo</Text>
            <Text style={styles.rangeValue}>{range.max.toFixed(1)}{unit}</Text>
          </View>
        </View>
      )}

      {alarm.zones.length > 0 && (
        <Text style={styles.zones}>{alarm.zones.join(", ")}</Text>
      )}

      {isActive && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => onAcknowledge(alarm.id)}
          >
            <Text style={styles.btnPrimaryText}>Reconocer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  containerInactive: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  date: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  type: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  valuesRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 8,
  },
  rangeRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 8,
  },
  valueBlock: {},
  valueLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  valueOutOfRange: {
    color: COLORS.error,
  },
  rangeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  zones: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  btnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnPrimaryText: {
    fontSize: 14,
    color: COLORS.surface,
    fontWeight: "600",
  },
});
