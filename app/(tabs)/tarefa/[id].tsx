import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTarefas } from '@/src/context/TarefasContext';

export default function TarefaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tarefas, toggleTarefa, deletarTarefa } = useTarefas();
  const router = useRouter();

  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>🔍</Text>
          <Text style={styles.notFoundTitle}>Tarefa não encontrada</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function handleDeletar() {
    Alert.alert(
      '🗑️ Deletar Tarefa',
      `Tem certeza que deseja deletar "${tarefa!.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            deletarTarefa(tarefa!.id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header manual */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBack, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.headerBackText}>‹ Voltar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.content}>
        {/* Status badge */}
        <View
          style={[
            styles.statusBadge,
            tarefa.feita ? styles.statusBadgeDone : styles.statusBadgePending,
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {tarefa.feita ? '✅ Concluída' : '🕐 Pendente'}
          </Text>
        </View>

        {/* Card da tarefa */}
        <View style={styles.tarefaCard}>
          <Text style={styles.tarefaIdLabel}>ID DA TAREFA</Text>
          <Text style={styles.tarefaId}>#{tarefa.id}</Text>

          <View style={styles.divider} />

          <Text style={styles.tarefaTituloLabel}>TÍTULO</Text>
          <Text
            style={[
              styles.tarefaTitulo,
              tarefa.feita && styles.tarefaTituloDone,
            ]}
          >
            {tarefa.titulo}
          </Text>
        </View>

        {/* Ações */}
        <Pressable
          style={({ pressed }) => [
            styles.toggleBtn,
            tarefa.feita ? styles.toggleBtnUndo : styles.toggleBtnDone,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => toggleTarefa(tarefa.id)}
        >
          <Text style={styles.toggleBtnText}>
            {tarefa.feita ? '↩️  Marcar como Pendente' : '✅  Marcar como Concluída'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleDeletar}
        >
          <Text style={styles.deleteBtnText}>🗑️  Deletar Tarefa</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A3A',
  },
  headerBack: {
    width: 70,
  },
  headerBackText: {
    fontSize: 16,
    color: '#4F8EF7',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8F0FE',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusBadgePending: {
    backgroundColor: 'rgba(79,142,247,0.2)',
    borderWidth: 1,
    borderColor: '#4F8EF7',
  },
  statusBadgeDone: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    borderWidth: 1,
    borderColor: '#4CD964',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8F0FE',
  },
  tarefaCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3A50',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  tarefaIdLabel: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tarefaId: {
    fontSize: 13,
    color: '#4F8EF7',
    fontWeight: '600',
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A3A50',
    marginBottom: 16,
  },
  tarefaTituloLabel: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tarefaTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8F0FE',
    lineHeight: 28,
  },
  tarefaTituloDone: {
    textDecorationLine: 'line-through',
    color: '#6B8FA8',
  },
  toggleBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  toggleBtnDone: {
    backgroundColor: '#4CD964',
    shadowColor: '#4CD964',
  },
  toggleBtnUndo: {
    backgroundColor: '#4F8EF7',
    shadowColor: '#4F8EF7',
  },
  toggleBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FF453A',
  },
  deleteBtnText: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notFoundIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8F0FE',
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
