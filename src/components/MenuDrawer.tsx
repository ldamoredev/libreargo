import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import type { ComponentType } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import type { Hub } from "../types";
import {
  IcoBrote,
  IcoCampana,
  IcoCasa,
  IcoIdea,
  IcoPower,
  IcoTermometro,
  IcoX,
  type IconProps,
} from "./icons";

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
  readonly icon: ComponentType<IconProps>;
  readonly requiresActiveHub: boolean;
}

const MENU_ITEMS: readonly MenuItem[] = [
  { label: "Inicio", key: "Inicio", icon: IcoCasa, requiresActiveHub: false },
  {
    label: "Sensores",
    key: "Sensores",
    icon: IcoTermometro,
    requiresActiveHub: true,
  },
  {
    label: "Actuadores",
    key: "Actuadores",
    icon: IcoPower,
    requiresActiveHub: true,
  },
  {
    label: "Alarmas",
    key: "Alarmas",
    icon: IcoCampana,
    requiresActiveHub: true,
  },
  {
    label: "Cultivos",
    key: "Cultivos",
    icon: IcoBrote,
    requiresActiveHub: false,
  },
  {
    label: "Recomendaciones",
    key: "Recomendaciones",
    icon: IcoIdea,
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
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.menu, { paddingBottom: Math.max(insets.bottom, 12) }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.brand, { paddingTop: insets.top + 16 }]}>
            <View style={styles.brandIcon}>
              <IcoBrote size={32} color="#fff" />
            </View>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>LibreAgro</Text>
              <Text style={styles.brandSubtitle}>
                {activeHub ? activeHub.name : "Sin hub conectado"}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cerrar menú"
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <IcoX size={22} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.list,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            {MENU_ITEMS.map((item) => {
              const isDisabled = item.requiresActiveHub && activeHub === null;
              const isActive = item.key === activeKey && !isDisabled;
              const Icon = item.icon;
              const fg = isDisabled
                ? COLORS.textDisabled
                : isActive
                  ? COLORS.primary
                  : COLORS.text;
              const bg = isActive ? COLORS.primarySoft : "transparent";

              return (
                <TouchableOpacity
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{
                    disabled: isDisabled,
                    selected: isActive,
                  }}
                  onPress={() => {
                    if (!isDisabled) {
                      onSelect(item.key);
                      onClose();
                    }
                  }}
                  disabled={isDisabled}
                  activeOpacity={0.85}
                  style={[
                    styles.item,
                    { backgroundColor: bg },
                    isDisabled && styles.itemDisabled,
                  ]}
                >
                  <View
                    style={[
                      styles.itemIcon,
                      {
                        backgroundColor: isActive
                          ? COLORS.primary
                          : COLORS.surfaceAlt,
                      },
                    ]}
                  >
                    <Icon size={26} color={isActive ? "#fff" : fg} />
                  </View>
                  <Text style={[styles.itemLabel, { color: fg }]}>
                    {item.label}
                  </Text>
                  {isDisabled && (
                    <Text style={styles.itemHint}>Conectá un hub</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
  },
  menu: {
    width: 308,
    backgroundColor: COLORS.background,
    paddingTop: 0,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  brandTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 64,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  itemDisabled: {
    opacity: 0.55,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },
  itemHint: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
