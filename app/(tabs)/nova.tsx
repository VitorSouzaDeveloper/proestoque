import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTarefas } from '@/src/context/TarefasContext';

export default function NovaTarefaScreen() {
  const [titulo, setTitulo] = useState('');
  const { adicionarTarefa } = useTarefas();
  const router = useRouter();

  function handleAdicionar() {
    if (titulo.trim() === '') {
      Alert.alert(
        '⚠️ Campo vazio',
        'Por favor, digite o título da tarefa antes de adicionar.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    adicionarTarefa(titulo.trim());
    setTitulo('');
    router.push('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>✏️</Text>
            <Text style={styles.heroTitle}>Nova Tarefa</Text>
            <Text style={styles.heroSubtitle}>
              Adicione uma nova tarefa à sua lista
            </Text>
          </View>

          {/* Card de formulário */}
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Título da Tarefa</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Estudar para a prova..."
              placeholderTextColor="#4A5568"
              multiline
              maxLength={120}
              returnKeyType="done"
              onSubmitEditing={handleAdicionar}
            />
            <Text style={styles.charCount}>{titulo.length}/120</Text>

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
                titulo.trim() === '' && styles.addButtonDisabled,
              ]}
              onPress={handleAdicionar}
            >
              <Text style={styles.addButtonText}>＋  Adicionar Tarefa</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={() => {
                setTitulo('');
                router.push('/');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>

          {/* Dica */}
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Toque em uma tarefa na lista para marcá-la como concluída. Segure para
              ver os detalhes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E8F0FE',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B8FA8',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3A50',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#6B8FA8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0D1B2A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2A3A50',
    color: '#E8F0FE',
    fontSize: 16,
    padding: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  charCount: {
    fontSize: 11,
    color: '#4A5568',
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  addButtonDisabled: {
    backgroundColor: '#2A3A50',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2A3A50',
  },
  cancelButtonPressed: {
    backgroundColor: '#1A2A3A',
  },
  cancelButtonText: {
    color: '#6B8FA8',
    fontSize: 15,
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E2A3A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3A50',
    gap: 12,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#6B8FA8',
    lineHeight: 20,
  },
});
