import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import type { Crop } from "../types";
import { BigButton } from "./ui";
import { IcoBrote, IcoX } from "./icons";

interface CropFormProps {
  readonly visible: boolean;
  readonly crop?: Crop;
  readonly onSave: (data: {
    name: string;
    startDate: string;
    period: number;
    zones: string[];
  }) => void;
  readonly onCancel: () => void;
}

interface FieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder: string;
  readonly keyboardType?: "default" | "numeric";
}

function Field({
  label,
  hint,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      {hint && <Text style={fieldStyles.hint}>{hint}</Text>}
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textDisabled}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  input: {
    minHeight: 56,
    borderWidth: 2,
    borderColor: COLORS.divider,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 17,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
});

export function CropForm({ visible, crop, onSave, onCancel }: CropFormProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(crop?.name ?? "");
  const [startDate, setStartDate] = useState(
    crop ? crop.startDate.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [period, setPeriod] = useState(crop ? String(crop.period) : "");
  const [zonesText, setZonesText] = useState(crop?.zones.join(", ") ?? "");

  const footerPaddingBottom = Math.max(24, insets.bottom + 16);
  const isEdit = !!crop;
  const canSave =
    name.trim().length > 0 &&
    period.trim().length > 0 &&
    Number.parseInt(period, 10) > 0;

  const handleSave = () => {
    const parsedPeriod = Number.parseInt(period, 10);
    if (!Number.isFinite(parsedPeriod) || parsedPeriod <= 0) return;
    const zones = zonesText
      .split(",")
      .map((z) => z.trim())
      .filter((z) => z.length > 0);
    onSave({
      name: name.trim(),
      startDate: `${startDate}T00:00:00Z`,
      period: parsedPeriod,
      zones,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View style={[styles.overlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <IcoBrote size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>
                {isEdit ? "Editar cultivo" : "Nuevo cultivo"}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              onPress={onCancel}
              style={styles.closeBtn}
              activeOpacity={0.85}
            >
              <IcoX size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Field
              label="Nombre"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Tomate Cherry"
            />
            <Field
              label="Fecha de inicio"
              hint="Formato: AAAA-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-03-01"
            />
            <Field
              label="Período de cosecha"
              hint="Cantidad de días hasta la cosecha"
              value={period}
              onChangeText={setPeriod}
              placeholder="90"
              keyboardType="numeric"
            />
            <Field
              label="Zonas"
              hint="Separá cada zona con una coma"
              value={zonesText}
              onChangeText={setZonesText}
              placeholder="Invernadero 1, Campo norte"
            />
          </ScrollView>

          <View
            style={[styles.actions, { paddingBottom: footerPaddingBottom }]}
          >
            <View style={styles.actionSlot}>
              <BigButton
                label="Cancelar"
                onPress={onCancel}
                variant="outline"
                color={COLORS.textSecondary}
              />
            </View>
            <View style={styles.actionSlot}>
              <BigButton
                label={isEdit ? "Guardar cambios" : "Crear cultivo"}
                onPress={canSave ? handleSave : () => undefined}
                color={canSave ? COLORS.primary : COLORS.textDisabled}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    maxHeight: "92%",
  },
  handle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.divider,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: COLORS.surface,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  actionSlot: {
    flex: 1,
  },
});
