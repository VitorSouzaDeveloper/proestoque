import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useProducts } from '@/src/contexts/ProductsContext';
import { FormProduto } from '@/src/components/FormProduto';
import { Button } from '@/src/components/Button';
import { colors, typography, spacing } from '@/src/constants/theme';

export default function EditarProdutoScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, editarProduto, excluirProduto } = useProducts();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja realmente sair e descartá-las?',
        [
          { text: 'Não', style: 'cancel', onPress: () => {} },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isDirty]);

  // Encontra o produto correspondente ao ID
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produto não encontrado no estoque.</Text>
        <Button title="Voltar" onPress={() => router.back()} style={styles.backBtn} />
      </View>
    );
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await editarProduto(produto.id, data);
      setIsDirty(false); // Reset dirty so it doesn't prompt when navigating back after save
      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      setTimeout(() => {
        router.back();
      }, 0);
    } catch (error: any) {
      console.error('Erro ao editar produto:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao atualizar o produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza de que deseja remover "${produto.nome}" permanentemente? Esta ação não poderá ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProduto(produto.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Ocorreu um erro ao excluir o produto.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FormProduto
        initialValues={produto}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText="Salvar Alterações"
        onDirtyChange={setIsDirty}
      >
        <Button
          title="Voltar"
          onPress={() => router.back()}
          style={styles.voltarBtn}
          textStyle={styles.voltarBtnText}
        />
        <Button
          title="Excluir Produto"
          onPress={handleDeleteConfirm}
          style={styles.deleteBtn}
          textStyle={styles.deleteBtnText}
        />
        <Button
          title="Movimentações de Estoque"
          onPress={() => router.push(`/produtos/movimentacoes?id=${produto.id}` as any)}
          style={styles.movimentacoesBtn}
          textStyle={styles.movimentacoesBtnText}
        />
      </FormProduto>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  backBtn: {
    minWidth: 150,
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.error,
    marginTop: spacing.md,
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteBtnText: {
    color: colors.error,
  },
  voltarBtn: {
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  voltarBtnText: {
    color: colors.textPrimary,
  },
  movimentacoesBtn: {
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  movimentacoesBtnText: {
    color: colors.primary,
  },
});
