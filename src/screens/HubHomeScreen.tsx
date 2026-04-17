import { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "../constants";
import { useHubStore } from "../stores/hubStore";
import { useHubDataStore } from "../stores/hubDataStore";
import {
  AlarmSummaryCard,
  DeviceListItem,
  DeviceFilter,
  ZoneFilterSheet,
} from "../components";
import type { FilterType } from "../components";
import type { Device } from "../types";
import type { RootStackParamList } from "../navigation/types";
import { getPrimaryVisualMeasurement } from "../features/sensors/sensorMeasurementCatalog";
import { getSensorRangeVisual } from "../utils/getSensorRangeVisual";

type Props = NativeStackScreenProps<RootStackParamList, "HubHome">;

function resolveFilter(
  initialFilter: RootStackParamList["HubHome"]["filter"]
): FilterType {
  return initialFilter === "sensores"
    ? "sensores"
    : initialFilter === "actuadores"
      ? "actuadores"
      : "todos";
}

export function HubHomeScreen({ navigation, route }: Props) {
  const { hubHash, filter: initialFilter } = route.params;
  const hub = useHubStore((s) => s.hubs.find((h) => h.hash === hubHash));
  const { alarms, devices, config, actual, loading, error, loadHubData, clearData } =
    useHubDataStore();
  const [filter, setFilter] = useState<FilterType>(() =>
    resolveFilter(initialFilter)
  );
  const [selectedZones, setSelectedZones] = useState<readonly string[]>([]);
  const [zoneSheetVisible, setZoneSheetVisible] = useState(false);

  useEffect(() => {
    setFilter(resolveFilter(initialFilter));
  }, [initialFilter]);

  useEffect(() => {
    if (hub) {
      loadHubData(hub.ip);
    }

    return () => {
      clearData();
    };
  }, [hub, loadHubData, clearData]);

  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    devices.forEach((device) => device.zones.forEach((zone) => zones.add(zone)));
    return Array.from(zones).sort();
  }, [devices]);

  const filteredDevices = useMemo(() => {
    const byType =
      filter === "sensores"
        ? devices.filter((device) => device.type === "sensor")
        : filter === "actuadores"
          ? devices.filter((device) => device.type === "actuator")
          : devices;

    if (selectedZones.length === 0) {
      return byType;
    }

    const zoneSet = new Set(selectedZones);
    return byType.filter((device) =>
      device.zones.some((zone) => zoneSet.has(zone))
    );
  }, [devices, filter, selectedZones]);

  const primaryVisualMetricCounts = useMemo(() => {
    const counts = new Map<string, number>();

    filteredDevices.forEach((device) => {
      if (device.type !== "sensor") {
        return;
      }

      const measurementKey =
        device.sensorType ?? getPrimaryVisualMeasurement(device.subtype)?.key ?? "temperature";

      counts.set(measurementKey, (counts.get(measurementKey) ?? 0) + 1);
    });

    return counts;
  }, [filteredDevices]);

  const getSensorVisualForDevice = useCallback(
    (device: Device) => {
      if (device.type !== "sensor") {
        return null;
      }

      const measurementKey =
        device.sensorType ?? getPrimaryVisualMeasurement(device.subtype)?.key ?? "temperature";

      if (primaryVisualMetricCounts.get(measurementKey) !== 1) {
        return null;
      }

      return getSensorRangeVisual(device, config, actual);
    },
    [actual, config, primaryVisualMetricCounts]
  );

  const handleDevicePress = useCallback(
    (device: Device) => {
      if (device.type === "sensor") {
        navigation.navigate("SensorDetail", {
          hubHash,
          sensorId: device.id,
        });
      } else if (device.relayAddress != null) {
        navigation.navigate("ActuatorDetail", {
          hubHash,
          relayAddress: device.relayAddress,
        });
      }
    },
    [navigation, hubHash]
  );

  const handleAlarmsPress = useCallback(() => {
    navigation.navigate("Alarms", { hubHash });
  }, [navigation, hubHash]);

  const zonesButtonDisabled = availableZones.length === 0;
  const zonesButtonLabel =
    selectedZones.length > 0 ? `Zonas (${selectedZones.length})` : "Zonas";

  if (!hub) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hub no encontrado</Text>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("HubList")}
        >
          Volver al listado
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando datos del hub...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDevices}
        keyExtractor={(device) => device.id}
        renderItem={({ item }) => (
          <DeviceListItem
            device={item}
            sensorVisual={getSensorVisualForDevice(item)}
            onPress={handleDevicePress}
          />
        )}
        ListHeaderComponent={
          <>
            <AlarmSummaryCard alarms={alarms} onPress={handleAlarmsPress} />
            <View style={styles.filtersRow}>
              <DeviceFilter active={filter} onChange={setFilter} />
              <TouchableOpacity
                style={[
                  styles.zonesBtn,
                  selectedZones.length > 0 && styles.zonesBtnActive,
                  zonesButtonDisabled && styles.zonesBtnDisabled,
                ]}
                onPress={() => setZoneSheetVisible(true)}
                disabled={zonesButtonDisabled}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.zonesBtnText,
                    selectedZones.length > 0 && styles.zonesBtnTextActive,
                    zonesButtonDisabled && styles.zonesBtnTextDisabled,
                  ]}
                >
                  {zonesButtonLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No hay dispositivos {filter !== "todos" ? `de tipo "${filter}"` : ""}
              {selectedZones.length > 0 ? " en las zonas seleccionadas" : ""}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <ZoneFilterSheet
        visible={zoneSheetVisible}
        availableZones={availableZones}
        selectedZones={selectedZones}
        onChange={setSelectedZones}
        onClose={() => setZoneSheetVisible(false)}
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
    backgroundColor: COLORS.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
  },
  linkText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 24,
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  zonesBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  zonesBtnActive: {
    backgroundColor: COLORS.primary,
  },
  zonesBtnDisabled: {
    opacity: 0.4,
  },
  zonesBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  zonesBtnTextActive: {
    color: COLORS.surface,
  },
  zonesBtnTextDisabled: {
    color: COLORS.textDisabled,
  },
  empty: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
