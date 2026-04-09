import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants";
import type { ConnectionMode } from "../types";

interface AddHubModalProps {
  readonly visible: boolean;
  readonly mode: ConnectionMode;
  readonly loading: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function AddHubModal({
  visible,
  mode,
  loading,
  onConfirm,
  onCancel,
}: AddHubModalProps) {
  const isOnline = mode === "online";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {isOnline ? (
            <>
              <Text style={styles.title}>Cambiar a modo Directo</Text>
              <Text style={styles.body}>
                Para agregar un hub, necesitas estar conectado directamente a su
                red Wi-Fi. Se cambiará al modo Directo para completar el alta.
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={onCancel}
                >
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={onConfirm}
                >
                  <Text style={styles.btnConfirmText}>
                    Cambiar a Directo
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Agregar Hub</Text>
              <Text style={styles.body}>
                Asegurate de estar conectado al Wi-Fi del hub (red tipo
                "moni-XXXX") y presioná "Agregar" para registrarlo.
              </Text>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={styles.loader}
                />
              ) : (
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={onCancel}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={onConfirm}
                  >
                    <Text style={styles.btnConfirmText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnCancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  btnConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnConfirmText: {
    fontSize: 15,
    color: COLORS.surface,
    fontWeight: "600",
  },
  loader: {
    marginVertical: 8,
  },
});
