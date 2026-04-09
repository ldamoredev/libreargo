import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS, DIRECT_MODE_IP } from "../constants";
import type { ConnectionMode, Hub } from "../types";
import {
  getConfig,
  validateHubConfig,
  InvalidHubConfigError,
} from "../services/hubDataService";

type AddHubStep = "confirm-switch" | "searching" | "error";

interface AddHubModalProps {
  readonly visible: boolean;
  readonly initialMode: ConnectionMode;
  readonly onAdded: (hub: Hub) => void;
  readonly onCancel: () => void;
  readonly onSwitchToDirecto: () => void;
}

function initialStep(mode: ConnectionMode): AddHubStep {
  return mode === "online" ? "confirm-switch" : "searching";
}

export function AddHubModal({
  visible,
  initialMode,
  onAdded,
  onCancel,
  onSwitchToDirecto,
}: AddHubModalProps) {
  const [step, setStep] = useState<AddHubStep>(() => initialStep(initialMode));
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (visible) {
      setStep(initialStep(initialMode));
      setErrorMessage("");
    }
  }, [visible, initialMode]);

  useEffect(() => {
    if (!visible || step !== "searching") {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const rawConfig = await getConfig(DIRECT_MODE_IP);
        const config = validateHubConfig(rawConfig);

        if (cancelled) {
          return;
        }

        const hub: Hub = {
          hash: config.hash,
          name: config.incubator_name,
          ip: DIRECT_MODE_IP,
          status: "conectado",
          addedAt: new Date().toISOString(),
        };

        onAdded(hub);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof InvalidHubConfigError
            ? error.message
            : "No se pudo conectar al hub. Verificá la conexión Wi-Fi.";

        setErrorMessage(message);
        setStep("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, step, onAdded]);

  const handleConfirmSwitch = () => {
    onSwitchToDirecto();
    setStep("searching");
  };

  const handleRetry = () => {
    setErrorMessage("");
    setStep("searching");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {step === "confirm-switch" && (
            <>
              <Text style={styles.title}>Cambiar a modo Directo</Text>
              <Text style={styles.body}>
                Para agregar un hub necesitamos pasar a modo Directo. Asegurate
                de estar conectado al Wi-Fi del hub (red tipo &quot;moni-XXXX&quot;)
                y confirmá para continuar.
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={handleConfirmSwitch}
                >
                  <Text style={styles.btnConfirmText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === "searching" && (
            <>
              <Text style={styles.title}>Buscando hub...</Text>
              <Text style={styles.body}>
                Consultando el hub conectado por Wi-Fi. Esto puede tardar unos
                segundos.
              </Text>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loader}
              />
            </>
          )}

          {step === "error" && (
            <>
              <Text style={styles.title}>No se pudo agregar el hub</Text>
              <Text style={styles.body}>{errorMessage}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnConfirm} onPress={handleRetry}>
                  <Text style={styles.btnConfirmText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
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
