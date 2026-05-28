import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { Categoria, Produto, StatusEstoque, getStatusEstoque } from '@/src/data/mockData';
import { CATEGORIAS } from '@/src/data/mockData';

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
type CategoriaFiltro = 'Todos' | Categoria;

export default function ProdutosScreen() {
  const router = useRouter();
  const { produtos } = useProducts();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaFiltro>('Todos');

  // Categorias que de fato existem nos dados atuais
  const categoriasDisponiveis: CategoriaFiltro[] = useMemo(() => {
    const existentes = new Set(produtos.map((p) => p.categoria));
    return ['Todos', ...CATEGORIAS.filter((c) => existentes.has(c))];
  }, [produtos]);

  // Filtro com useMemo
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria =
        categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva;
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
          const ativo = cat === categoriaAtiva;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, ativo && styles.chipAtivo]}
              onPress={() => setCategoriaAtiva(cat)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, ativo && styles.chipTextoAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
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
  addBtnHeader: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
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
