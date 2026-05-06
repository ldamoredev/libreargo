import type { ReactNode } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants";

interface BigButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly color?: string;
  readonly icon?: ReactNode;
  readonly variant?: "solid" | "outline";
  readonly accessibilityLabel?: string;
  readonly disabled?: boolean;
}

export function BigButton({
  label,
  onPress,
  color = COLORS.primary,
  icon,
  variant = "solid",
  accessibilityLabel,
  disabled = false,
}: BigButtonProps) {
  const solid = variant === "solid";
  const effectiveColor = disabled ? COLORS.textMuted : color;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: solid ? effectiveColor : COLORS.surface,
          borderColor: effectiveColor,
          borderWidth: solid ? 0 : 2.5,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: solid ? "#fff" : effectiveColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 72,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
