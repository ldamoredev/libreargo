import { useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "../constants";
import { useHubDataStore } from "../stores/hubDataStore";
import { AlarmCard } from "../components/AlarmCard";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Alarms">;

export function AlarmsScreen(_props: Props) {
  const alarms = useHubDataStore((s) => s.alarms);
  const config = useHubDataStore((s) => s.config);

  const sorted = [...alarms].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleAcknowledge = useCallback((id: string) => {
    useHubDataStore.setState((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id ? { ...a, status: "acknowledged" as const } : a
      ),
    }));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(alarm) => alarm.id}
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            config={config}
            onAcknowledge={handleAcknowledge}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sin alarmas registradas</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
