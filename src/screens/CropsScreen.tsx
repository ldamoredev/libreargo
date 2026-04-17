import { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants";
import { useCropStore, createCrop } from "../stores/cropStore";
import { CropForm } from "../components/CropForm";
import { FAB } from "../components/FAB";
import type { Crop } from "../types";

type CropFilter = "todos" | "actuales";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function isCurrentCrop(harvestDate: string, now: Date): boolean {
  return harvestDate.slice(0, 10) >= now.toISOString().slice(0, 10);
}

function CropCard({
  crop,
  isExpired,
  onEdit,
  onDelete,
}: {
  crop: Crop;
  isExpired: boolean;
  onEdit: (crop: Crop) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View
      testID={`crop-card-${crop.id}`}
      style={[styles.cropCard, isExpired && styles.cropCardExpired]}
    >
      <View style={styles.cropHeader}>
        <Text style={styles.cropName}>{crop.name}</Text>
        <View style={styles.cropActions}>
          <TouchableOpacity onPress={() => onEdit(crop)}>
            <Text style={styles.editBtn}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(crop.id)}>
            <Text style={styles.deleteBtn}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cropDates}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Inicio</Text>
          <Text style={styles.dateValue}>{formatDate(crop.startDate)}</Text>
        </View>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Cosecha</Text>
          <Text style={styles.dateValue}>{formatDate(crop.harvestDate)}</Text>
        </View>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Período</Text>
          <Text style={styles.dateValue}>{crop.period} días</Text>
        </View>
      </View>
      {crop.zones.length > 0 && (
        <View style={styles.zonesRow}>
          {crop.zones.map((z) => (
            <View key={z} style={styles.zoneChip}>
              <Text style={styles.zoneChipText}>{z}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function CropsScreen() {
  const { crops, addCrop, updateCrop, deleteCrop } = useCropStore();
  const [formVisible, setFormVisible] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | undefined>();
  const [filter, setFilter] = useState<CropFilter>("todos");

  const handleAdd = useCallback(() => {
    setEditingCrop(undefined);
    setFormVisible(true);
  }, []);

  const handleEdit = useCallback((crop: Crop) => {
    setEditingCrop(crop);
    setFormVisible(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert("Eliminar cultivo", "Esta acción no se puede deshacer.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteCrop(id) },
      ]);
    },
    [deleteCrop]
  );

  const handleSave = useCallback(
    (data: { name: string; startDate: string; period: number; zones: string[] }) => {
      if (editingCrop) {
        updateCrop(editingCrop.id, data);
      } else {
        addCrop(createCrop(data));
      }
      setFormVisible(false);
    },
    [editingCrop, addCrop, updateCrop]
  );

  const now = new Date();
  const visibleCrops =
    filter === "todos"
      ? crops
      : crops.filter((crop) => isCurrentCrop(crop.harvestDate, now));

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "todos" && styles.filterTabActive]}
          onPress={() => setFilter("todos")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "todos" && styles.filterTabTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "actuales" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("actuales")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "actuales" && styles.filterTabTextActive,
            ]}
          >
            Actuales
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={visibleCrops}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CropCard
            crop={item}
            isExpired={!isCurrentCrop(item.harvestDate, now)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {filter === "actuales"
                ? "No hay cultivos en el período actual"
                : "Sin cultivos"}
            </Text>
            <Text style={styles.emptyBody}>
              {filter === "actuales"
                ? "Cambiar a Todos para ver cultivos cosechados."
                : 'Presioná "+" para agregar tu primer cultivo.'}
            </Text>
          </View>
        }
      />
      <FAB onPress={handleAdd} />
      <CropForm
        visible={formVisible}
        crop={editingCrop}
        onSave={handleSave}
        onCancel={() => setFormVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.surface,
  },
  list: {
    padding: 8,
    paddingBottom: 100,
  },
  cropCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cropCardExpired: {
    opacity: 0.55,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cropName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  cropActions: {
    flexDirection: "row",
    gap: 16,
  },
  editBtn: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  deleteBtn: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: "500",
  },
  cropDates: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 2,
  },
  zonesRow: {
    flexDirection: "row",
    gap: 8,
  },
  zoneChip: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneChipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
