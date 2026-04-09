import { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "../constants";
import { useHubStore } from "../stores/hubStore";
import {
  ConnectionModeSwitch,
  HubListItem,
  FAB,
  AddHubModal,
} from "../components";
import type { Hub } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HubList">;

export function HubListScreen({ navigation }: Props) {
  const { hubs, connectionMode, setConnectionMode, addHub, selectHub } =
    useHubStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleHubPress = useCallback(
    (hub: Hub) => {
      if (hub.status === "desconectado") {
        Alert.alert(
          "Hub desconectado",
          `No se puede acceder a "${hub.name}" porque no está conectado.`
        );
        return;
      }

      selectHub(hub.hash);
      navigation.navigate("HubHome", { hubHash: hub.hash });
    },
    [navigation, selectHub]
  );

  const handleAddHub = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSwitchToDirecto = useCallback(() => {
    setConnectionMode("directo");
  }, [setConnectionMode]);

  const handleHubAdded = useCallback(
    (hub: Hub) => {
      addHub(hub);
      setModalVisible(false);
      Alert.alert("Hub agregado", `"${hub.name}" fue registrado.`);
    },
    [addHub]
  );

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <ConnectionModeSwitch
          mode={connectionMode}
          onToggle={setConnectionMode}
        />
        <Text style={styles.modeHint}>
          {connectionMode === "directo"
            ? "Wi-Fi directo al hub"
            : "Conexión por internet"}
        </Text>
      </View>

      <FlatList
        data={hubs}
        keyExtractor={(hub) => hub.hash}
        renderItem={({ item }) => (
          <HubListItem hub={item} onPress={handleHubPress} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sin hubs registrados</Text>
            <Text style={styles.emptyBody}>
              Conectate al Wi-Fi de un hub y presioná &quot;+&quot; para
              agregarlo.
            </Text>
          </View>
        }
      />

      <FAB onPress={handleAddHub} />

      <AddHubModal
        visible={modalVisible}
        initialMode={connectionMode}
        onAdded={handleHubAdded}
        onCancel={handleModalCancel}
        onSwitchToDirecto={handleSwitchToDirecto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  switchContainer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 6,
  },
  modeHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
