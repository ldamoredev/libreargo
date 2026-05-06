import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { Hub } from "../types";
import { Card, IconBadge, Dot } from "./ui";
import { IcoChevron, IcoWifi } from "./icons";

interface HubListItemProps {
  readonly hub: Hub;
  readonly onPress: (hub: Hub) => void;
}

export function HubListItem({ hub, onPress }: HubListItemProps) {
  const isConnected = hub.status === "conectado";

  return (
    <Card
      onPress={() => onPress(hub)}
      accessibilityLabel={`${hub.name}, ${isConnected ? "conectado" : "desconectado"}`}
      style={styles.card}
    >
      <IconBadge bg={isConnected ? COLORS.successSoft : "#EEE7D9"} size={64}>
        <IcoWifi
          size={34}
          color={isConnected ? COLORS.success : COLORS.disconnected}
        />
      </IconBadge>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {hub.name}
        </Text>
        <Text style={styles.ip} numberOfLines={1}>
          {hub.ip}
        </Text>
        <View style={styles.statusRow}>
          <Dot color={isConnected ? COLORS.success : COLORS.disconnected} size={10} />
          <Text
            style={[
              styles.statusText,
              {
                color: isConnected ? COLORS.success : COLORS.textMuted,
              },
            ]}
          >
            {isConnected ? "Conectado" : "Sin conexión"}
          </Text>
        </View>
      </View>
      <IcoChevron size={28} color={COLORS.textMuted} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 18,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  ip: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
