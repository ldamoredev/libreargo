import { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "../constants";
import {
  ACTUAL_KEY_MAP,
  READING_KEY_MAP,
  SENSOR_MEASUREMENTS,
  UNIT_MAP,
} from "../features/sensors/sensorMeasurementCatalog";
import { useHubDataStore } from "../stores/hubDataStore";
import { mockReadings } from "../mocks";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SensorDetail">;

function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function SensorDetailScreen({ route, navigation }: Props) {
  const { sensorType } = route.params;
  const actual = useHubDataStore((s) => s.actual);
  const config = useHubDataStore((s) => s.config);

  const sensorConfig = config?.sensors.find(
    (s) => s.type === sensorType && s.enabled
  );

  const measurements = SENSOR_MEASUREMENTS[sensorType] ?? [
    { key: "temperature" as const, label: "Temperatura" },
  ];

  const zones = sensorConfig?.zones ?? [];

  const errors = useMemo(() => {
    if (!actual) return [];
    const allErrors: string[] = [];
    if (actual.errors.temperature.length > 0)
      allErrors.push(...actual.errors.temperature);
    if (actual.errors.humidity.length > 0)
      allErrors.push(...actual.errors.humidity);
    if (actual.errors.sensors.length > 0)
      allErrors.push(...actual.errors.sensors);
    return allErrors;
  }, [actual]);

  if (!actual) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sin datos del sensor</Text>
        <Text style={styles.link} onPress={() => navigation.goBack()}>
          Volver
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header info */}
      <View style={styles.infoCard}>
        <Text style={styles.sensorType}>{sensorType.toUpperCase()}</Text>
        <Text style={styles.sensorSubtype}>Sensor</Text>
        {zones.length > 0 && (
          <View style={styles.zonesRow}>
            {zones.map((z) => (
              <View key={z} style={styles.zoneChip}>
                <Text style={styles.zoneChipText}>{z}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Errores */}
      {errors.length > 0 && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerTitle}>Errores activos</Text>
          {errors.map((e, i) => (
            <Text key={i} style={styles.errorBannerText}>
              {e}
            </Text>
          ))}
        </View>
      )}

      {/* Mediciones actuales */}
      <View style={styles.measurementsRow}>
        {measurements.map(({ key, label }) => {
          const actualKey = ACTUAL_KEY_MAP[key];
          const rawValue = actualKey
            ? (actual as unknown as Record<string, unknown>)[actualKey]
            : undefined;
          const value =
            typeof rawValue === "string" ? parseFloat(rawValue) : null;
          return (
            <View key={key} style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>{label}</Text>
              <Text style={styles.measurementValue}>
                {value != null ? value.toFixed(1) : "—"}
              </Text>
              <Text style={styles.measurementUnit}>{UNIT_MAP[key] ?? ""}</Text>
            </View>
          );
        })}
      </View>

      {/* Histórico corto */}
      <Text style={styles.sectionTitle}>Histórico reciente</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.tableCellTime]}>Hora</Text>
        {measurements.map(({ key, label }) => (
          <Text key={key} style={styles.tableCell}>
            {label}
          </Text>
        ))}
      </View>
      <FlatList
        data={mockReadings.slice(0, 15)}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellTime]}>
              {formatTime(item.timestamp)}
            </Text>
            {measurements.map(({ key }) => {
              const readingKey = READING_KEY_MAP[key];
              const val = readingKey ? item[readingKey] : null;
              return (
                <Text key={key} style={styles.tableCell}>
                  {typeof val === "number" ? val.toFixed(1) : "—"}
                </Text>
              );
            })}
          </View>
        )}
        contentContainerStyle={styles.tableContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
  },
  link: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sensorType: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  sensorSubtype: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  zonesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  zoneChip: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneChipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  errorBanner: {
    backgroundColor: "#FFEBEE",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
  },
  errorBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.error,
    marginBottom: 4,
  },
  errorBannerText: {
    fontSize: 13,
    color: COLORS.error,
  },
  measurementsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  measurementCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  measurementLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
  },
  measurementUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
  },
  tableCellTime: {
    flex: 1.2,
    textAlign: "left",
    color: COLORS.textSecondary,
  },
  tableContent: {
    paddingBottom: 24,
  },
});
