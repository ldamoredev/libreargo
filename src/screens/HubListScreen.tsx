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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { useHubStore } from "../stores/hubStore";
import {
  ConnectionModeSwitch,
  HubListItem,
  FAB,
  AddHubModal,
} from "../components";
import { Card, IconBadge, BigButton } from "../components/ui";
import { IcoWifi } from "../components/icons";
import type { Hub } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HubList">;

export function HubListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
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
      <FlatList
        data={hubs}
        keyExtractor={(hub) => hub.hash}
        renderItem={({ item }) => (
          <HubListItem hub={item} onPress={handleHubPress} />
        )}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <ConnectionModeSwitch
              mode={connectionMode}
              onToggle={setConnectionMode}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cómo conectar un hub"
              onPress={() => setInfoVisible(true)}
              activeOpacity={0.85}
            >
              <Card style={styles.helpCard}>
                <IconBadge bg={COLORS.primary} size={56}>
                  <IcoWifi size={30} color="#fff" />
                </IconBadge>
                <View style={styles.helpText}>
                  <Text style={styles.helpTitle}>Cómo conectar un hub</Text>
                  <Text style={styles.helpBody}>
                    Conectate al Wi-Fi del hub y tocá el botón{" "}
                    <Text style={styles.helpBold}>+</Text> para agregarlo.
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sin hubs registrados</Text>
            <Text style={styles.emptyBody}>
              Conectate al Wi-Fi de un hub y presioná{"\n"}el botón verde para
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

      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View
          style={[
            styles.infoOverlay,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
        >
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
            <View style={styles.infoActions}>
              <BigButton
                label="Cerrar"
                onPress={() => setInfoVisible(false)}
              />
            </View>
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
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 14,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.primarySoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  helpBody: {
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  helpBold: {
    fontWeight: "800",
  },
  list: {
    paddingBottom: 120,
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  infoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  infoCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 24,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  infoActions: {
    marginTop: 24,
  },
});
