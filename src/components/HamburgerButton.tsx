import { TouchableOpacity, StyleSheet } from "react-native";
import { IcoMenu } from "./icons";

interface HamburgerButtonProps {
  readonly onPress: () => void;
  readonly color?: string;
}

export function HamburgerButton({
  onPress,
  color = "#fff",
}: HamburgerButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      onPress={onPress}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <IcoMenu size={28} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
