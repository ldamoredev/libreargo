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
import { COLORS } from "../constants";
import type { Crop } from "../types";

interface CropFormProps {
  readonly visible: boolean;
  readonly crop?: Crop;
  readonly onSave: (data: { name: string; startDate: string; period: number; zones: string[] }) => void;
  readonly onCancel: () => void;
}

export function CropForm({ visible, crop, onSave, onCancel }: CropFormProps) {
  const [name, setName] = useState(crop?.name ?? "");
  const [startDate, setStartDate] = useState(
    crop ? crop.startDate.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [period, setPeriod] = useState(crop ? String(crop.period) : "");
  const [zonesText, setZonesText] = useState(crop?.zones.join(", ") ?? "");

  const isEdit = !!crop;
  const canSave = name.trim().length > 0 && period.trim().length > 0;

  const handleSave = () => {
    const parsedPeriod = parseInt(period, 10);
    if (isNaN(parsedPeriod) || parsedPeriod <= 0) return;
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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>
              {isEdit ? "Editar cultivo" : "Nuevo cultivo"}
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Tomate Cherry"
              placeholderTextColor={COLORS.textDisabled}
            />

            <Text style={styles.label}>Fecha de inicio (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-03-01"
              placeholderTextColor={COLORS.textDisabled}
            />

            <Text style={styles.label}>Período (días)</Text>
            <TextInput
              style={styles.input}
              value={period}
              onChangeText={setPeriod}
              placeholder="90"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textDisabled}
            />

            <Text style={styles.label}>Zonas (separadas por coma)</Text>
            <TextInput
              style={styles.input}
              value={zonesText}
              onChangeText={setZonesText}
              placeholder="Zona A, Zona B"
              placeholderTextColor={COLORS.textDisabled}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSave, !canSave && styles.btnDisabled]}
                onPress={handleSave}
                disabled={!canSave}
              >
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
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
  btnSave: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  btnSaveText: {
    fontSize: 15,
    color: COLORS.surface,
    fontWeight: "600",
  },
});
