import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";

export type FilterType = "todos" | "sensores" | "actuadores";

interface DeviceFilterProps {
  readonly active: FilterType;
  readonly onChange: (filter: FilterType) => void;
}

const FILTERS: readonly { key: FilterType; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "sensores", label: "Sensores" },
  { key: "actuadores", label: "Actuadores" },
];

export function DeviceFilter({ active, onChange }: DeviceFilterProps) {
  return (
    <View style={styles.container}>
      {FILTERS.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[styles.tab, active === key && styles.tabActive]}
          onPress={() => onChange(key)}
        >
          <Text
            style={[styles.tabText, active === key && styles.tabTextActive]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.surface,
  },
});
