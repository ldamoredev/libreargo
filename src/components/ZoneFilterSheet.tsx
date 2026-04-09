import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { COLORS } from "../constants";

interface ZoneFilterSheetProps {
  readonly visible: boolean;
  readonly availableZones: readonly string[];
  readonly selectedZones: readonly string[];
  readonly onChange: (zones: readonly string[]) => void;
  readonly onClose: () => void;
}

export function ZoneFilterSheet({
  visible,
  availableZones,
  selectedZones,
  onChange,
  onClose,
}: ZoneFilterSheetProps) {
  const [draft, setDraft] = useState<readonly string[]>(selectedZones);

  useEffect(() => {
    if (visible) {
      setDraft(selectedZones);
    }
  }, [visible, selectedZones]);

  const toggle = (zone: string) => {
    setDraft((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleClear = () => {
    setDraft([]);
  };

  const handleApply = () => {
    onChange(draft);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar por zonas</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearBtn}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {availableZones.length === 0 ? (
              <Text style={styles.empty}>No hay zonas disponibles</Text>
            ) : (
              availableZones.map((zone) => {
                const checked = draft.includes(zone);

                return (
                  <TouchableOpacity
                    key={zone}
                    style={styles.row}
                    onPress={() => toggle(zone)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.checkbox, checked && styles.checkboxChecked]}
                    >
                      {checked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.rowLabel}>{zone}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnApply} onPress={handleApply}>
              <Text style={styles.btnApplyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  clearBtn: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 20,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 14,
    paddingVertical: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnCancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  btnApply: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnApplyText: {
    fontSize: 15,
    color: COLORS.surface,
    fontWeight: "600",
  },
});
