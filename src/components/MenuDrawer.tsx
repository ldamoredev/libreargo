import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { COLORS } from "../constants";
import type { Hub } from "../types";

type MenuItemKey =
  | "Inicio"
  | "Sensores"
  | "Actuadores"
  | "Alarmas"
  | "Cultivos"
  | "Recomendaciones";

interface MenuItem {
  readonly label: string;
  readonly key: MenuItemKey;
  readonly requiresActiveHub: boolean;
}

const MENU_ITEMS: readonly MenuItem[] = [
  { label: "Inicio", key: "Inicio", requiresActiveHub: false },
  { label: "Sensores", key: "Sensores", requiresActiveHub: true },
  { label: "Actuadores", key: "Actuadores", requiresActiveHub: true },
  { label: "Alarmas", key: "Alarmas", requiresActiveHub: true },
  { label: "Cultivos", key: "Cultivos", requiresActiveHub: false },
  {
    label: "Recomendaciones",
    key: "Recomendaciones",
    requiresActiveHub: false,
  },
];

interface MenuDrawerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelect: (key: MenuItemKey) => void;
  readonly activeHub: Hub | null;
  readonly activeKey?: string;
}

export function MenuDrawer({
  visible,
  onClose,
  onSelect,
  activeHub,
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
            const isDisabled = item.requiresActiveHub && activeHub === null;
            const isActive = item.key === activeKey && !isDisabled;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  isDisabled && styles.menuItemDisabled,
                ]}
                onPress={() => {
                  if (!isDisabled) {
                    onSelect(item.key);
                    onClose();
                  }
                }}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                    isDisabled && styles.menuItemTextDisabled,
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
