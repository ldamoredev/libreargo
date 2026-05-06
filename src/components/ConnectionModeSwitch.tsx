import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { ConnectionMode } from "../types";

interface ConnectionModeSwitchProps {
  readonly mode: ConnectionMode;
  readonly onToggle: (mode: ConnectionMode) => void;
}

const MODES: readonly { key: ConnectionMode; label: string }[] = [
  { key: "directo", label: "Directo" },
  { key: "online", label: "Online" },
];

export function ConnectionModeSwitch({
  mode,
  onToggle,
}: ConnectionModeSwitchProps) {
  return (
    <View style={styles.container}>
      {MODES.map(({ key, label }) => {
        const on = mode === key;
        return (
          <TouchableOpacity
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onToggle(key)}
            activeOpacity={0.85}
            style={[styles.option, on && styles.optionActive]}
          >
            <Text
              style={[styles.optionText, on && styles.optionTextActive]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 4,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  option: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: "#fff",
  },
});
