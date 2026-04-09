import { TouchableOpacity, View, StyleSheet } from "react-native";

interface HamburgerButtonProps {
  readonly onPress: () => void;
  readonly color?: string;
}

export function HamburgerButton({
  onPress,
  color = "#FFFFFF",
}: HamburgerButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: "center",
    gap: 4,
  },
  line: {
    width: 22,
    height: 2.5,
    borderRadius: 1,
  },
});
