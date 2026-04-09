import { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
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
} from "../components";
import type { FilterType } from "../components";
import type { Device } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HubHome">;

export function HubHomeScreen({ navigation, route }: Props) {
  const { hubHash, filter: initialFilter } = route.params;
  const hub = useHubStore((s) => s.hubs.find((h) => h.hash === hubHash));
  const { alarms, devices, loading, error, loadHubData, clearData } =
    useHubDataStore();
  const [filter, setFilter] = useState<FilterType>(
    initialFilter === "sensores"
      ? "sensores"
      : initialFilter === "actuadores"
        ? "actuadores"
        : "todos"
  );

  useEffect(() => {
    if (hub) {
      loadHubData(hub.ip);
    }
    return () => {
      clearData();
    };
  }, [hub, loadHubData, clearData]);

  const filteredDevices = useMemo(() => {
    if (filter === "sensores") return devices.filter((d) => d.type === "sensor");
    if (filter === "actuadores") return devices.filter((d) => d.type === "actuator");
    return devices;
  }, [devices, filter]);

  const handleDevicePress = useCallback(
    (device: Device) => {
      if (device.type === "sensor") {
        navigation.navigate("SensorDetail", {
          hubHash,
          sensorType: device.subtype,
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
          <DeviceListItem device={item} onPress={handleDevicePress} />
        )}
        ListHeaderComponent={
          <>
            <AlarmSummaryCard alarms={alarms} onPress={handleAlarmsPress} />
            <DeviceFilter active={filter} onChange={setFilter} />
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No hay dispositivos {filter !== "todos" ? `de tipo "${filter}"` : ""}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
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
  empty: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
