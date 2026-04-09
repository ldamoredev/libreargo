import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { ConnectionMode } from "../types";

interface ConnectionModeSwitchProps {
  readonly mode: ConnectionMode;
  readonly onToggle: (mode: ConnectionMode) => void;
}

export function ConnectionModeSwitch({
  mode,
  onToggle,
}: ConnectionModeSwitchProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, mode === "directo" && styles.optionActive]}
        onPress={() => onToggle("directo")}
      >
        <Text
          style={[
            styles.optionText,
            mode === "directo" && styles.optionTextActive,
          ]}
        >
          Directo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, mode === "online" && styles.optionActive]}
        onPress={() => onToggle("online")}
      >
        <Text
          style={[
            styles.optionText,
            mode === "online" && styles.optionTextActive,
          ]}
        >
          Online
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 3,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 17,
  },
  optionActive: {
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
