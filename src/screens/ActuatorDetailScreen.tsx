import { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, TOGGLE_THROTTLE_MS } from "../constants";
import { useHubDataStore } from "../stores/hubDataStore";
import { toggleRelay } from "../services/hubDataService";
import { useHubStore } from "../stores/hubStore";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ActuatorDetail">;

function ChannelControl({
  channel,
  commandState,
  inputState,
  disabled,
  onToggle,
}: {
  channel: number;
  commandState: boolean;
  inputState: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const hasDiscrepancy = commandState !== inputState;

  return (
    <View style={styles.channelCard}>
      <Text style={styles.channelTitle}>Canal {channel + 1}</Text>

      <View style={styles.statesRow}>
        <View style={styles.stateBlock}>
          <Text style={styles.stateLabel}>Comando</Text>
          <View
            style={[
              styles.stateIndicator,
              { backgroundColor: commandState ? COLORS.success : COLORS.disconnected },
            ]}
          >
            <Text style={styles.stateIndicatorText}>
              {commandState ? "ON" : "OFF"}
            </Text>
          </View>
        </View>

        <View style={styles.stateBlock}>
          <Text style={styles.stateLabel}>Estado real</Text>
          <View
            style={[
              styles.stateIndicator,
              { backgroundColor: inputState ? COLORS.success : COLORS.disconnected },
            ]}
          >
            <Text style={styles.stateIndicatorText}>
              {inputState ? "ON" : "OFF"}
            </Text>
          </View>
        </View>
      </View>

      {hasDiscrepancy && (
        <View style={styles.discrepancyBanner}>
          <Text style={styles.discrepancyText}>
            Discrepancia: el estado real no coincide con el comando enviado
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.toggleBtn, disabled && styles.toggleBtnDisabled]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleBtnText}>
          {commandState ? "Apagar" : "Encender"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function ActuatorDetailScreen({ route, navigation }: Props) {
  const { relayAddress } = route.params;
  const relay = useHubDataStore((s) =>
    s.relays.find((r) => r.address === relayAddress)
  );
  const hub = useHubStore((s) =>
    s.hubs.find((h) => h.hash === route.params.hubHash)
  );
  const [throttled, setThrottled] = useState(false);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = useCallback(
    async (ch: number) => {
      if (!hub || !relay) return;

      setThrottled(true);
      try {
        const result = await toggleRelay(hub.ip, relayAddress, ch);
        if (result === "OK") {
          // Mock: invertir estado localmente
          useHubDataStore.setState((state) => ({
            relays: state.relays.map((r) => {
              if (r.address !== relayAddress) return r;
              const newState: [boolean, boolean] = [r.state[0], r.state[1]];
              newState[ch] = !newState[ch];
              const newInput: [boolean, boolean] = [r.input_state[0], r.input_state[1]];
              newInput[ch] = !newInput[ch];
              return { ...r, state: newState, input_state: newInput };
            }),
          }));
        }
      } catch {
        Alert.alert("Error", "No se pudo ejecutar el comando. Verificá la conexión.");
      } finally {
        throttleTimer.current = setTimeout(() => {
          setThrottled(false);
        }, TOGGLE_THROTTLE_MS);
      }
    },
    [hub, relay, relayAddress]
  );

  // Limpiar timer en unmount
  // (useRef no necesita cleanup en dependency, pero sí al desmontar)
  const cleanupRef = useRef(() => {
    if (throttleTimer.current) clearTimeout(throttleTimer.current);
  });
  // Registrar cleanup una sola vez
  useState(() => {
    return () => cleanupRef.current();
  });

  if (!relay) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Actuador no encontrado</Text>
        <Text style={styles.link} onPress={() => navigation.goBack()}>
          Volver
        </Text>
      </View>
    );
  }

  const zones = relay.zones ?? [];

  return (
    <View style={styles.container}>
      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.alias}>{relay.alias}</Text>
        <Text style={styles.subtitle}>
          Relé · Dirección {relay.address} · {relay.active ? "Activo" : "Inactivo"}
        </Text>
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

      {!relay.active && (
        <View style={styles.inactiveBanner}>
          <Text style={styles.inactiveBannerText}>
            Este relé está inactivo o sin comunicación
          </Text>
        </View>
      )}

      {/* Canales */}
      <ChannelControl
        channel={0}
        commandState={relay.state[0]}
        inputState={relay.input_state[0]}
        disabled={throttled || !relay.active}
        onToggle={() => handleToggle(0)}
      />
      <ChannelControl
        channel={1}
        commandState={relay.state[1]}
        inputState={relay.input_state[1]}
        disabled={throttled || !relay.active}
        onToggle={() => handleToggle(1)}
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
  alias: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
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
  inactiveBanner: {
    backgroundColor: "#FFF3E0",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
  },
  inactiveBannerText: {
    fontSize: 13,
    color: COLORS.warning,
    fontWeight: "500",
  },
  channelCard: {
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
  channelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  statesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  stateBlock: {
    flex: 1,
    alignItems: "center",
  },
  stateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  stateIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  stateIndicatorText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.surface,
  },
  discrepancyBanner: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  discrepancyText: {
    fontSize: 13,
    color: COLORS.warning,
    fontWeight: "500",
  },
  toggleBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleBtnDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  toggleBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
});
