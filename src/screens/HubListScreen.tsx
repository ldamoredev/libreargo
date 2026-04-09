import { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, DIRECT_MODE_IP } from "../constants";
import { useHubStore } from "../stores/hubStore";
import {
  ConnectionModeSwitch,
  HubListItem,
  FAB,
  AddHubModal,
} from "../components";
import { getConfig } from "../services/hubDataService";
import type { Hub } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HubList">;

export function HubListScreen({ navigation }: Props) {
  const { hubs, connectionMode, setConnectionMode, addHub, selectHub } =
    useHubStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [addingHub, setAddingHub] = useState(false);

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

  const handleModalConfirm = useCallback(async () => {
    if (connectionMode === "online") {
      // Cambia a modo directo y cierra el modal.
      // El usuario deberá presionar "+" de nuevo estando en modo directo.
      setConnectionMode("directo");
      setModalVisible(false);
      return;
    }

    // Modo directo: simula consulta a GET /config
    setAddingHub(true);
    try {
      const config = await getConfig(DIRECT_MODE_IP);
      const newHub: Hub = {
        hash: config.hash,
        name: config.incubator_name,
        ip: DIRECT_MODE_IP,
        status: "conectado",
        addedAt: new Date().toISOString(),
      };
      addHub(newHub);
      setModalVisible(false);
      Alert.alert("Hub agregado", `"${config.incubator_name}" fue registrado.`);
    } catch {
      Alert.alert("Error", "No se pudo conectar al hub. Verificá la conexión Wi-Fi.");
    } finally {
      setAddingHub(false);
    }
  }, [connectionMode, setConnectionMode, addHub]);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

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
              Conectate al Wi-Fi de un hub y presioná "+" para agregarlo.
            </Text>
          </View>
        }
      />

      <FAB onPress={handleAddHub} />

      <AddHubModal
        visible={modalVisible}
        mode={connectionMode}
        loading={addingHub}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
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
