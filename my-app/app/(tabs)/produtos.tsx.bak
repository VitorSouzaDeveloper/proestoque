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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '@/src/constants/theme';
import {
  PRODUTOS_MOCK,
  CATEGORIAS,
  Produto,
  Categoria,
  getStatusEstoque,
  StatusEstoque,
} from '@/src/data/mockData';

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

function ProdutoItem({ item }: { item: Produto }) {
  const status = getStatusEstoque(item);
  return (
    <View style={styles.produtoItem}>
      <Text style={styles.produtoEmoji}>{item.emoji}</Text>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.produtoQtd}>{item.quantidade} {item.unidade}</Text>
      </View>
      <BadgeStatus status={status} />
    </View>
  );
}

// ─────────────────────────────────────────────
// Tela Produtos
// ─────────────────────────────────────────────

type CategoriaFiltro = 'Todos' | Categoria;

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaFiltro>('Todos');

  // Categorias que de fato existem nos dados
  const categoriasDisponiveis: CategoriaFiltro[] = useMemo(() => {
    const existentes = new Set(PRODUTOS_MOCK.map((p) => p.categoria));
    return ['Todos', ...CATEGORIAS.filter((c) => existentes.has(c))];
  }, []);

  // Filtro com useMemo
  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria =
        categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva;
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaAtiva]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Produtos</Text>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color={colors.textOnPrimary} />
        </TouchableOpacity>
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
        renderItem={({ item }) => <ProdutoItem item={item} />}
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
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
    flexGrow: 0,   // impede o ScrollView de expandir verticalmente
    flexShrink: 0,
  },
  chipsContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center', // mantém os chips alinhados ao centro vertical
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center', // evita que o chip estique verticalmente
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
    paddingBottom: spacing['2xl'],
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
  produtoEmoji: {
    fontSize: 26,
    marginRight: spacing.md,
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
});
