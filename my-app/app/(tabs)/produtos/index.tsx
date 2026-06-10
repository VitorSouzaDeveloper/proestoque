import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { useCategorias } from '@/src/hooks/useCategorias';
import { Produto, StatusEstoque} from '@/src/types/produto';
import { LoadingView } from '@/src/components/LoadingView';
import { ErrorView } from '@/src/components/ErrorView';

// ─────────────────────────────────────────────
// Badge de status
// ─────────────────────────────────────────────
function BadgeStatus({ status }: { status: StatusEstoque }) {
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

// ─────────────────────────────────────────────
// Item de produto
// ─────────────────────────────────────────────
interface ProdutoItemProps {
  item: Produto;
  onPress: () => void;
}

function ProdutoItem({ item, onPress }: ProdutoItemProps) {
  // Simulando status já que foi movido pra API ou mantendo a lógica se possível
  const status = (item as any).quantidade === 0 ? 'sem_estoque' : ((item as any).quantidade < (item as any).quantidadeMinima ? 'baixo' : 'normal');
  return (
    <TouchableOpacity style={styles.produtoItem} onPress={onPress} activeOpacity={0.7}>
      {item.foto ? (
        <Image source={{ uri: item.foto }} style={styles.produtoThumbnail} />
      ) : item.emoji ? (
        <View style={[styles.emojiContainer, { backgroundColor: item.categoria?.cor || colors.surfaceAlt }]}>
          <Text style={styles.produtoEmoji}>{item.emoji}</Text>
        </View>
      ) : (
        <View style={styles.emojiContainer}>
          <Text style={styles.produtoEmoji}>📦</Text>
        </View>
      )}
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.produtoQtd}>
          {item.quantidade} {item.unidade}
        </Text>
      </View>
      <BadgeStatus status={status} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Tela Produtos
// ─────────────────────────────────────────────

export default function ProdutosScreen() {
  const router = useRouter();
  
  const { produtos, isLoading: loadingProdutos, error: errorProdutos, carregarProdutos } = useProducts();
  const { categorias, isLoading: loadingCategorias, error: errorCategorias } = useCategorias();
  
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos');
  const [refreshing, setRefreshing] = useState(false);

  const categoriasDisponiveis = useMemo(() => {
    return [{ id: 'Todos', nome: 'Todos' }, ...categorias];
  }, [categorias]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria =
        categoriaAtiva === 'Todos' || p.categoriaId === categoriaAtiva;
      return matchBusca && matchCategoria;
    });
  }, [produtos, busca, categoriaAtiva]);

  const handleNavigateToNew = () => {
    router.push('/produtos/novo' as any);
  };

  const handleNavigateToEdit = (id: string) => {
    router.push({
      pathname: '/produtos/[id]' as any,
      params: { id },
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  if (loadingProdutos && produtos.length === 0) {
    return <LoadingView mensagem="Carregando produtos..." />;
  }

  if (errorProdutos && produtos.length === 0) {
    return <ErrorView mensagem={errorProdutos} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Produtos</Text>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Chips de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        style={styles.chipsScroll}
      >
        {categoriasDisponiveis.map((cat) => {
          const ativo = cat.id === categoriaAtiva;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, ativo && styles.chipAtivo]}
              onPress={() => setCategoriaAtiva(cat.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, ativo && styles.chipTextoAtivo]}>
                {cat.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <ProdutoItem item={item} onPress={() => handleNavigateToEdit(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitulo}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtitulo}>
              Tente buscar por outro nome ou categoria.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNavigateToNew}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.textOnPrimary} />
      </TouchableOpacity>
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
  titulo: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },

  // Chips
  chipsScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
  },
  chipTextoAtivo: {
    color: colors.textOnPrimary,
  },

  // Lista
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: 100, // Espaço extra para o FAB não cobrir itens
  },

  // Produto item
  produtoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
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

  // Badge
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.base,
  },
  emptyTitulo: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitulo: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
