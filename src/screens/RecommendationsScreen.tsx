import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants";
import { getRecommendations } from "../services/hubDataService";
import { Card, IconBadge } from "../components/ui";
import { IcoIdea, IcoReloj } from "../components/icons";
import type { Recommendation } from "../types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (sameDate(d, today)) return `Hoy ${time}`;
  if (sameDate(d, yesterday)) return `Ayer ${time}`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${time}`;
}

interface RecommendationCardProps {
  readonly rec: Recommendation;
}

function RecommendationCard({ rec }: RecommendationCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <IconBadge bg={COLORS.primarySoft} size={56}>
          <IcoIdea size={36} color={COLORS.primary} />
        </IconBadge>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {rec.title}
          </Text>
          <View style={styles.metaRow}>
            <IcoReloj size={14} color={COLORS.textMuted} />
            <Text style={styles.cardDate}>{formatDate(rec.date)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardContent}>{rec.content}</Text>
    </Card>
  );
}

export function RecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<readonly Recommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await getRecommendations();
        if (!cancelled) setRecommendations(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando recomendaciones…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendations}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RecommendationCard rec={item} />}
        ListHeaderComponent={
          <View style={styles.heroBanner}>
            <View style={styles.heroIcon}>
              <IcoIdea size={56} color="#fff" />
            </View>
            <View style={styles.heroText}>
              <Text
                style={styles.heroTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.78}
              >
                Recomendaciones
              </Text>
              <Text style={styles.heroSubtitle}>
                Consejos para tus cultivos
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconBadge bg={COLORS.primarySoft} size={88}>
              <IcoIdea size={56} color={COLORS.primary} />
            </IconBadge>
            <Text style={styles.emptyTitle}>Sin recomendaciones</Text>
            <Text style={styles.emptyBody}>
              Cuando tengamos consejos para tu cultivo, aparecerán acá.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
    marginTop: 4,
  },
  card: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
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
