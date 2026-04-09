import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

interface FABProps {
  readonly onPress: () => void;
  readonly label?: string;
}

export function FAB({ onPress, label = "+" }: FABProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    fontSize: 28,
    color: COLORS.surface,
    fontWeight: "300",
    marginTop: -2,
  },
});
