import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/src/contexts/ProductsContext';
import { FormProduto } from '@/src/components/FormProduto';
import { Button } from '@/src/components/Button';
import { colors, typography, spacing } from '@/src/constants/theme';

export default function EditarProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, editarProduto, excluirProduto } = useProducts();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (data: any) => {
    setLoading(true);
    try {
      editarProduto(produto.id, data);
      router.back();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto.');
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
          onPress: () => {
            excluirProduto(produto.id);
            router.back();
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
      >
        <Button
          title="Excluir Produto"
          onPress={handleDeleteConfirm}
          style={styles.deleteBtn}
          textStyle={styles.deleteBtnText}
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
});
