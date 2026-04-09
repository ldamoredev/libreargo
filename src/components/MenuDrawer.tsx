import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { COLORS } from "../constants";

interface MenuItem {
  readonly label: string;
  readonly key: string;
  readonly disabled?: boolean;
}

const MENU_ITEMS: readonly MenuItem[] = [
  { label: "Inicio", key: "Inicio" },
  { label: "Sensores", key: "Sensores" },
  { label: "Actuadores", key: "Actuadores" },
  { label: "Alarmas", key: "Alarmas" },
  { label: "Cultivos", key: "Cultivos" },
  { label: "Recomendaciones", key: "Recomendaciones" },
];

interface MenuDrawerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelect: (key: string) => void;
  readonly activeKey?: string;
}

export function MenuDrawer({
  visible,
  onClose,
  onSelect,
  activeKey,
}: MenuDrawerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>LibreAgro</Text>
          <View style={styles.divider} />
          {MENU_ITEMS.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  item.disabled && styles.menuItemDisabled,
                ]}
                onPress={() => {
                  if (!item.disabled) {
                    onSelect(item.key);
                    onClose();
                  }
                }}
                disabled={item.disabled}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                    item.disabled && styles.menuItemTextDisabled,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
  },
  menu: {
    width: 280,
    backgroundColor: COLORS.surface,
    paddingTop: 60,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: "#E8F5E9",
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuItemTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  menuItemTextDisabled: {
    color: COLORS.textDisabled,
  },
});
