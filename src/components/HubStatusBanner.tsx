import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import { IcoAlerta, IcoCheck, IcoChevron } from "./icons";
import type { SemaforoState } from "../utils/semaforo";

interface HubStatusBannerProps {
  readonly state: SemaforoState;
  readonly badCount: number;
  readonly warnCount: number;
  readonly onPress?: () => void;
}

const TITLE: Record<SemaforoState, string> = {
  bad: "Revisar ahora",
  warn: "Atención",
  ok: "Todo bien",
};

function buildSubtitle(badCount: number, warnCount: number): string {
  if (badCount > 0) {
    return badCount === 1
      ? "1 problema detectado"
      : `${badCount} problemas detectados`;
  }
  if (warnCount > 0) {
    return "Valores cerca del límite";
  }
  return "Todos los valores OK";
}

export function HubStatusBanner({
  state,
  badCount,
  warnCount,
  onPress,
}: HubStatusBannerProps) {
  const bg =
    state === "bad"
      ? COLORS.error
      : state === "warn"
        ? COLORS.warning
        : COLORS.success;
  const Icon = state === "bad" ? IcoAlerta : IcoCheck;
  const subtitle = buildSubtitle(badCount, warnCount);
  const accessibilityLabel = `${TITLE[state]}. ${subtitle}`;
  const bannerStyle = [styles.banner, { backgroundColor: bg }];
  const content = (
    <>
      <View style={styles.iconWrap}>
        <Icon size={56} color="#fff" />
      </View>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {TITLE[state]}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      {onPress && (
        <View style={styles.chevronWrap}>
          <IcoChevron size={28} color="#fff" />
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Abre el listado de alarmas"
        activeOpacity={0.86}
        onPress={onPress}
        style={bannerStyle}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
      style={bannerStyle}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.95)",
    marginTop: 4,
  },
  chevronWrap: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
});
