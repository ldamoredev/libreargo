import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { Device, SensorRangeVisual } from "../types";
import { SensorRangeIndicator } from "./SensorRangeIndicator";

interface DeviceListItemProps {
  readonly device: Device;
  readonly sensorVisual?: SensorRangeVisual | null;
  readonly onPress: (device: Device) => void;
}

const SENSOR_ICON = "S";
const ACTUATOR_ICON = "A";

export function DeviceListItem({
  device,
  sensorVisual,
  onPress,
}: DeviceListItemProps) {
  const isSensor = device.type === "sensor";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(device)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: isSensor ? "#E3F2FD" : "#FFF3E0" },
        ]}
      >
        <Text
          style={[
            styles.iconText,
            { color: isSensor ? "#1565C0" : "#E65100" },
          ]}
        >
          {isSensor ? SENSOR_ICON : ACTUATOR_ICON}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={styles.subtype}>
          {isSensor ? "Sensor" : "Actuador"} · {device.subtype}
        </Text>
        {device.zones.length > 0 && (
          <Text style={styles.zones} numberOfLines={1}>
            {device.zones.join(", ")}
          </Text>
        )}
        {isSensor && sensorVisual ? (
          <SensorRangeIndicator visual={sensorVisual} />
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  subtype: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  zones: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
});
