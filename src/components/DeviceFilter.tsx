import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";

export type FilterType = "todos" | "sensores" | "actuadores";

interface DeviceFilterProps {
  readonly active: FilterType;
  readonly onChange: (filter: FilterType) => void;
}

const FILTERS: readonly { key: FilterType; label: string }[] = [
  { key: "todos", label: "Todo" },
  { key: "sensores", label: "Sensores" },
  { key: "actuadores", label: "Actuadores" },
];

export function DeviceFilter({ active, onChange }: DeviceFilterProps) {
  return (
    <View style={styles.container}>
      {FILTERS.map(({ key, label }) => {
        const on = active === key;
        return (
          <TouchableOpacity
            key={key}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por ${label}`}
            accessibilityState={{ selected: on }}
            onPress={() => onChange(key)}
            activeOpacity={0.85}
            style={[styles.tab, on && styles.tabActive]}
          >
            <Text style={[styles.tabText, on && styles.tabTextActive]}>
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
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: "#fff",
  },
});
