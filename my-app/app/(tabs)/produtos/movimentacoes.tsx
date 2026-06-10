import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/src/services/api';
import { colors, spacing, typography, borderRadius } from '@/src/constants/theme';
import { LoadingView } from '@/src/components/LoadingView';
import { ErrorView } from '@/src/components/ErrorView';
import { Button } from '@/src/components/Button';
import { useProducts } from '@/src/contexts/ProductsContext';

export default function MovimentacoesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProdutoById, carregarProdutos } = useProducts();
  const produto = getProdutoById(id as string);

  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const carregarMovimentacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/produtos/${id}/movimentacoes`);
      setMovimentacoes(res.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      carregarMovimentacoes();
    }
  }, [id]);

  const handleSalvar = async () => {
    const qtdNum = Number(quantidade);
    if (!quantidade || isNaN(qtdNum) || qtdNum <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade válida maior que zero.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/produtos/${id}/movimentacao`, {
        tipo,
        quantidade: qtdNum,
        observacao
      });
      // Recarrega a lista de movimentações e os produtos globais para atualizar o estoque na UI
      setQuantidade('');
      setObservacao('');
      carregarMovimentacoes();
      carregarProdutos();
      Alert.alert('Sucesso', 'Movimentação registrada com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao registrar movimentação');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingView mensagem="Carregando histórico..." />;
  if (error) return <ErrorView mensagem={error} onRetry={carregarMovimentacoes} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Estoque</Text>
        <Text style={styles.subtitle}>{produto?.nome}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[styles.tipoBtn, tipo === 'ENTRADA' && styles.tipoBtnEntrada]}
            onPress={() => setTipo('ENTRADA')}
          >
            <Text style={[styles.tipoBtnText, tipo === 'ENTRADA' && styles.tipoBtnTextActive]}>ENTRADA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipoBtn, tipo === 'SAIDA' && styles.tipoBtnSaida]}
            onPress={() => setTipo('SAIDA')}
          >
            <Text style={[styles.tipoBtnText, tipo === 'SAIDA' && styles.tipoBtnTextActive]}>SAÍDA</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Observação (opcional)"
          placeholderTextColor={colors.textMuted}
          value={observacao}
          onChangeText={setObservacao}
        />

        <Button
          title="Registrar"
          onPress={handleSalvar}
          loading={submitting}
        />
      </View>

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.movItem}>
            <View style={[styles.movIcon, item.tipo === 'ENTRADA' ? styles.iconEntrada : styles.iconSaida]} />
            <View style={styles.movInfo}>
              <Text style={styles.movTipo}>
                {item.tipo} de {item.quantidade} {produto?.unidade}
              </Text>
              {item.observacao ? (
                <Text style={styles.movObs}>{item.observacao}</Text>
              ) : null}
              <Text style={styles.movData}>
                {new Date(item.criadoEm).toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma movimentação registrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  tipoContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tipoBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tipoBtnEntrada: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  tipoBtnSaida: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
  },
  tipoBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tipoBtnTextActive: {
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  list: {
    padding: spacing.lg,
  },
  movItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  movIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  iconEntrada: {
    backgroundColor: colors.success,
  },
  iconSaida: {
    backgroundColor: colors.error,
  },
  movInfo: {
    flex: 1,
  },
  movTipo: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  movObs: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  movData: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
