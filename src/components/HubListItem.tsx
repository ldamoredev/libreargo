import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { Hub } from "../types";

interface HubListItemProps {
  readonly hub: Hub;
  readonly onPress: (hub: Hub) => void;
}

export function HubListItem({ hub, onPress }: HubListItemProps) {
  const isConnected = hub.status === "conectado";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(hub)}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.indicator,
            { backgroundColor: isConnected ? COLORS.connected : COLORS.disconnected },
          ]}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{hub.name}</Text>
          <Text style={styles.ip}>{hub.ip}</Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: isConnected ? "#E8F5E9" : "#F5F5F5" },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isConnected ? COLORS.connected : COLORS.textSecondary },
            ]}
          >
            {isConnected ? "Conectado" : "Desconectado"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  ip: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
