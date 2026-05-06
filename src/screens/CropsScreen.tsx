import { useState, useCallback, useMemo } from "react";
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
import { Card, IconBadge, ZonaPill } from "../components/ui";
import { IcoBrote, IcoCalendario } from "../components/icons";
import type { Crop } from "../types";

type CropFilter = "todos" | "actuales";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatLocalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

function isCurrentCrop(
  startDate: string,
  harvestDate: string,
  now: Date
): boolean {
  const today = formatLocalDate(now);
  return startDate.slice(0, 10) <= today && harvestDate.slice(0, 10) >= today;
}

function isExpiredCrop(harvestDate: string, now: Date): boolean {
  return harvestDate.slice(0, 10) < formatLocalDate(now);
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

interface CropCardProps {
  readonly crop: Crop;
  readonly isExpired: boolean;
  readonly now: Date;
  readonly onEdit: (crop: Crop) => void;
  readonly onDelete: (id: string) => void;
}

function CropCard({ crop, isExpired, now, onEdit, onDelete }: CropCardProps) {
  const start = new Date(crop.startDate);
  const harvest = new Date(crop.harvestDate);
  const totalDays = Math.max(1, daysBetween(start, harvest));
  const elapsedDays = Math.min(totalDays, Math.max(0, daysBetween(start, now)));
  const progress = isExpired ? 100 : (elapsedDays / totalDays) * 100;
  const remaining = isExpired
    ? 0
    : Math.max(0, daysBetween(now, harvest));

  const accent = isExpired ? COLORS.textMuted : COLORS.primary;

  return (
    <Card
      style={[styles.cropCard, isExpired && styles.cropCardExpired]}
    >
      <View
        testID={`crop-card-${crop.id}`}
        style={[styles.cropCardInner, isExpired && styles.cropCardInnerExpired]}
      >
        <View style={styles.cropHero}>
          <IconBadge
            bg={isExpired ? "#EEEAE0" : COLORS.primarySoft}
            size={72}
          >
            <IcoBrote size={48} color={accent} />
          </IconBadge>
          <View style={styles.cropHeroText}>
            <Text style={styles.cropName} numberOfLines={2}>
              {crop.name}
            </Text>
            <Text style={styles.cropPeriod}>{crop.period} días</Text>
          </View>
        </View>

        <View style={styles.cropDates}>
          <View style={styles.dateBlock}>
            <View style={styles.dateRow}>
              <IcoCalendario size={20} color={COLORS.textMuted} />
              <Text style={styles.dateLabel}>Inicio</Text>
            </View>
            <Text style={styles.dateValue}>{formatDate(crop.startDate)}</Text>
          </View>
          <View style={styles.dateBlock}>
            <View style={styles.dateRow}>
              <IcoCalendario size={20} color={COLORS.textMuted} />
              <Text style={styles.dateLabel}>Cosecha</Text>
            </View>
            <Text style={styles.dateValue}>{formatDate(crop.harvestDate)}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {isExpired
              ? "Cosechado"
              : remaining === 0
                ? "Cosechar hoy"
                : `Faltan ${remaining} ${remaining === 1 ? "día" : "días"}`}
          </Text>
        </View>

        {crop.zones.length > 0 && (
          <View style={styles.zonesRow}>
            {crop.zones.map((z) => (
              <ZonaPill key={z} name={z} tone={isExpired ? "gray" : "green"} />
            ))}
          </View>
        )}

        <View style={styles.cropActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Editar ${crop.name}`}
            onPress={() => onEdit(crop)}
            activeOpacity={0.85}
            style={styles.actionBtn}
          >
            <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>
              Editar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${crop.name}`}
            onPress={() => onDelete(crop.id)}
            activeOpacity={0.85}
            style={styles.actionBtn}
          >
            <Text style={[styles.actionBtnText, { color: COLORS.error }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
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
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteCrop(id),
        },
      ]);
    },
    [deleteCrop]
  );

  const handleSave = useCallback(
    (data: {
      name: string;
      startDate: string;
      period: number;
      zones: string[];
    }) => {
      if (editingCrop) {
        updateCrop(editingCrop.id, data);
      } else {
        addCrop(createCrop(data));
      }
      setFormVisible(false);
    },
    [editingCrop, addCrop, updateCrop]
  );

  const now = useMemo(() => new Date(), []);
  const activeCount = useMemo(
    () =>
      crops.filter((c) => isCurrentCrop(c.startDate, c.harvestDate, now)).length,
    [crops, now]
  );
  const visibleCrops =
    filter === "todos"
      ? crops
      : crops.filter((crop) =>
          isCurrentCrop(crop.startDate, crop.harvestDate, now)
        );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleCrops}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CropCard
            crop={item}
            isExpired={isExpiredCrop(item.harvestDate, now)}
            now={now}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.heroBanner}>
              <View style={styles.heroIcon}>
                <IcoBrote size={56} color="#fff" />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Mis cultivos</Text>
                <Text style={styles.heroSubtitle}>
                  {activeCount === 0
                    ? "Sin cultivos activos"
                    : activeCount === 1
                      ? "1 cultivo en curso"
                      : `${activeCount} cultivos en curso`}
                </Text>
              </View>
            </View>
            <View style={styles.tabs}>
              {(["todos", "actuales"] as const).map((key) => {
                const on = filter === key;
                const label = key === "todos" ? "Todo" : "Actuales";
                return (
                  <TouchableOpacity
                    key={key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() => setFilter(key)}
                    activeOpacity={0.85}
                    style={[styles.tab, on && styles.tabActive]}
                  >
                    <Text style={[styles.tabText, on && styles.tabTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconBadge bg={COLORS.primarySoft} size={88}>
              <IcoBrote size={56} color={COLORS.primary} />
            </IconBadge>
            <Text style={styles.emptyTitle}>
              {filter === "actuales"
                ? "No hay cultivos en curso"
                : "Sin cultivos"}
            </Text>
            <Text style={styles.emptyBody}>
              {filter === "actuales"
                ? "Cambiar a Todo para ver los cosechados."
                : "Tocá el botón verde para agregar tu primer cultivo."}
            </Text>
          </View>
        }
      />
      <FAB onPress={handleAdd} accessibilityLabel="Agregar cultivo" />
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 14,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 6,
    gap: 14,
  },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    minHeight: 48,
    paddingHorizontal: 22,
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    shadowOpacity: 0.18,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: "#fff",
  },
  cropCard: {
    padding: 0,
    overflow: "hidden",
  },
  cropCardExpired: {},
  cropCardInner: {
    padding: 18,
    gap: 14,
  },
  cropCardInnerExpired: {
    opacity: 0.55,
  },
  cropHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cropHeroText: {
    flex: 1,
    minWidth: 0,
  },
  cropName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  cropPeriod: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginTop: 4,
  },
  cropDates: {
    flexDirection: "row",
    gap: 14,
  },
  dateBlock: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  progressWrap: {
    gap: 6,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.divider,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  zonesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropActions: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "800",
  },
  empty: {
    alignItems: "center",
    padding: 40,
    gap: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  emptyBody: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
});
