import type { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface IconBadgeProps {
  readonly children: ReactNode;
  readonly bg: string;
  readonly size?: number;
  readonly ring?: string;
}

export function IconBadge({
  children,
  bg,
  size = 88,
  ring,
}: IconBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: ring ?? "transparent",
          borderWidth: ring ? 3 : 0,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
