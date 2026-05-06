import { View } from "react-native";

interface DotProps {
  readonly color: string;
  readonly size?: number;
}

export function Dot({ color, size = 14 }: DotProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}
