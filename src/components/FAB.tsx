import { TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import { IcoPlus } from "./icons";

interface FABProps {
  readonly onPress: () => void;
  readonly accessibilityLabel?: string;
}

export function FAB({
  onPress,
  accessibilityLabel = "Agregar hub",
}: FABProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <IcoPlus size={44} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
