import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/src/contexts/ProductsContext';
import { FormProduto } from '@/src/components/FormProduto';
import { colors } from '@/src/constants/theme';

export default function NovoProdutoScreen() {
  const router = useRouter();
  const { adicionarProduto } = useProducts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await adicionarProduto(data);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      router.back();
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormProduto
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText="Cadastrar Produto"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
