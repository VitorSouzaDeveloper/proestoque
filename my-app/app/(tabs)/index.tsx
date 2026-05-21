import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '@/src/constants/theme';
import {
  Produto,
  getStatusEstoque,
  StatusEstoque,
} from '@/src/data/mockData';
import { useAuth } from '@/src/contexts/AuthContext';
import { useProducts } from '@/src/contexts/ProductsContext';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getSaudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────

interface BadgeStatusProps {
  status: StatusEstoque;
}

function BadgeStatus({ status }: BadgeStatusProps) {
  const config: Record<StatusEstoque, { label: string; bg: string; text: string }> = {
    normal: { label: 'Normal', bg: colors.successLight, text: colors.success },
    baixo: { label: 'Baixo', bg: colors.warningLight, text: colors.warning },
    sem_estoque: { label: 'Sem estoque', bg: colors.errorLight, text: colors.error },
  };
  const { label, bg, text } = config[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

interface CardResumoItemProps {
  label: string;
  valor: string | number;
  emoji: string;
  bg: string;
}

function CardResumoItem({ label, valor, emoji, bg }: CardResumoItemProps) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardValor}>{valor}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

interface ProdutoItemProps {
  item: Produto;
  onPress: () => void;
}

function ProdutoItem({ item, onPress }: ProdutoItemProps) {
  const status = getStatusEstoque(item);
  return (
    <TouchableOpacity style={styles.produtoItem} onPress={onPress} activeOpacity={0.7}>
      {item.foto ? (
        <Image source={{ uri: item.foto }} style={styles.produtoThumbnail} />
      ) : (
        <View style={styles.emojiContainer}>
          <Text style={styles.produtoEmoji}>{item.emoji || '📦'}</Text>
        </View>
      )}
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.produtoQtd}>{item.quantidade} {item.unidade}</Text>
      </View>
      <BadgeStatus status={status} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Tela principal
// ─────────────────────────────────────────────

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos } = useProducts();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const alertas = produtos.filter(
    (p) => getStatusEstoque(p) === 'baixo' || getStatusEstoque(p) === 'sem_estoque'
  );
  const valorTotal = produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0);
  const categorias = new Set(produtos.map((p) => p.categoria)).size;

  const cards: CardResumoItemProps[] = [
    { label: 'Produtos', valor: produtos.length, emoji: '📦', bg: colors.primarySubtle },
    { label: 'Alertas', valor: alertas.length, emoji: '⚠️', bg: colors.warningLight },
    { label: 'Categorias', valor: categorias, emoji: '🗂️', bg: colors.surfaceAlt },
    {
      label: 'Valor',
      valor: `R$${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      emoji: '💰',
      bg: colors.successLight,
    },
  ];

  // Inicial do nome para o avatar
  const inicial = user?.nome?.charAt(0).toUpperCase() || '?';

  const ListHeader = (
    <View>
      {/* Saudação + Avatar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.saudacao}>
            {getSaudacao()}, {user?.nome || 'Usuário'}
          </Text>
          <Text style={styles.subtitulo}>Visão geral do estoque</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
      </View>

      {/* Cards de resumo */}
      <View style={styles.cardsGrid}>
        {cards.map((c) => (
          <CardResumoItem key={c.label} {...c} />
        ))}
      </View>

      {/* Alertas de estoque crítico — somente se houver */}
      {alertas.length > 0 && (
        <View style={styles.alertaBox}>
          <Text style={styles.alertaTitulo}>⚠️ Estoque crítico ({alertas.length})</Text>
          {alertas.slice(0, 3).map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.alertaItem}
              onPress={() => router.push({ pathname: '/produtos/[id]' as any, params: { id: p.id } })}
              activeOpacity={0.7}
            >
              <Text style={styles.alertaNome} numberOfLines={1}>{p.nome}</Text>
              <Text style={styles.alertaQtd}>
                {p.quantidade}/{p.estoqueMinimo}
              </Text>
            </TouchableOpacity>
          ))}
          {alertas.length > 3 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/produtos')}
            >
              <Text style={styles.verTodos}>Ver todos →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Título da lista */}
      <Text style={styles.secaoTitulo}>Produtos recentes</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProdutoItem
            item={item}
            onPress={() => router.push({ pathname: '/produtos/[id]' as any, params: { id: item.id } })}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flex: 1,
  },
  saudacao: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitulo: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: 4,
  },

  // Avatar
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    ...shadows.md,
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  // Cards grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.sm,
  },
  card: {
    width: '47.5%',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  cardEmoji: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  cardValor: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  cardLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: typography.fontWeight.medium,
  },

  // Alerta estoque crítico
  alertaBox: {
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertaTitulo: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  alertaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  alertaNome: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  alertaQtd: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing.sm,
  },
  verTodos: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing.sm,
  },

  // Seção título
  secaoTitulo: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  // Produto item
  produtoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  produtoThumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtoEmoji: {
    fontSize: 26,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  produtoQtd: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Badge de status
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  // Empty
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing['2xl'],
    fontSize: typography.fontSize.base,
  },
});
