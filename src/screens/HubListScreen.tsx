import { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
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
  const [infoVisible, setInfoVisible] = useState(false);

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
        <View style={styles.switchRow}>
          <ConnectionModeSwitch
            mode={connectionMode}
            onToggle={setConnectionMode}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Información sobre modos de conexión"
            style={styles.infoButton}
            onPress={() => setInfoVisible(true)}
          >
            <Text style={styles.infoButtonText}>i</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.modeHint}>
          {connectionMode === "directo"
            ? "Wi-Fi directo al hub"
            : "Conexión por internet"}
        </Text>
        <View style={styles.guidanceCard}>
          <Text style={styles.guidanceTitle}>Cómo conectar un hub</Text>
          <Text style={styles.guidanceBody}>
            Conectate al Wi-Fi del hub, pasá a modo Directo y tocá "+" para
            agregarlo.
          </Text>
        </View>
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
        initialMode={connectionMode}
        onAdded={handleHubAdded}
        onCancel={handleModalCancel}
        onSwitchToDirecto={handleSwitchToDirecto}
      />

      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Modos de conexión</Text>
            <Text style={styles.infoSectionTitle}>Modo Directo</Text>
            <Text style={styles.infoBody}>
              Conexión al Wi-Fi del hub, sin internet. Se usa para dar de alta
              el hub y operar localmente.
            </Text>
            <Text style={styles.infoSectionTitle}>Modo Online</Text>
            <Text style={styles.infoBody}>
              Conexión por internet para acceder indirectamente a hubs que
              estén reportando datos.
            </Text>
            <TouchableOpacity
              style={styles.infoCloseButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.infoCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  switchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modeHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoButtonText: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  guidanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  guidanceBody: {
    fontSize: 14,
    lineHeight: 20,
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
  infoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  infoCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  infoCloseButton: {
    alignSelf: "flex-end",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  infoCloseButtonText: {
    fontSize: 15,
    color: COLORS.surface,
    fontWeight: "600",
  },
});
