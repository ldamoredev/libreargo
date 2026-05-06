import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants";
import { IcoZona } from "../icons";

interface ZonaPillProps {
  readonly name: string;
  readonly tone?: "green" | "gray";
}

export function ZonaPill({ name, tone = "green" }: ZonaPillProps) {
  const green = tone === "green";
  const bg = green ? COLORS.primarySoft : "#EEEAE0";
  const fg = green ? COLORS.primaryDark : COLORS.textSecondary;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <IcoZona size={16} color={fg} />
      <Text style={[styles.label, { color: fg }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
