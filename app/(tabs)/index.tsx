import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTarefas } from '@/src/context/TarefasContext';

export default function TarefasScreen() {
  const { tarefas, toggleTarefa } = useTarefas();
  const router = useRouter();

  const pendentes = tarefas.filter((t) => !t.feita).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Contador de pendentes */}
      <View style={styles.header}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{pendentes}</Text>
          <Text style={styles.counterLabel}>
            {pendentes === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
          </Text>
        </View>
        <View style={styles.counterBox}>
          <Text style={[styles.counterNumber, styles.doneNumber]}>
            {tarefas.length - pendentes}
          </Text>
          <Text style={styles.counterLabel}>concluídas</Text>
        </View>
      </View>

      {tarefas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyTitle}>Nenhuma tarefa!</Text>
          <Text style={styles.emptySubtitle}>Adicione uma nova tarefa na aba abaixo.</Text>
        </View>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.tarefaCard,
                item.feita && styles.tarefaCardDone,
                pressed && styles.tarefaCardPressed,
              ]}
              onPress={() => toggleTarefa(item.id)}
              onLongPress={() => router.push(`/tarefa/${item.id}`)}
            >
              <View style={[styles.checkbox, item.feita && styles.checkboxDone]}>
                {item.feita && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.tarefaContent}>
                <Text
                  style={[styles.tarefaTitulo, item.feita && styles.tarefaTituloDone]}
                  numberOfLines={2}
                >
                  {item.titulo}
                </Text>
                <Text style={styles.tarefaStatus}>
                  {item.feita ? '✅ Concluída' : '🕐 Pendente'}
                </Text>
              </View>
              <Pressable
                onPress={() => router.push(`/tarefa/${item.id}`)}
                style={styles.detailBtn}
                hitSlop={8}
              >
                <Text style={styles.detailBtnText}>›</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
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
    gap: 12,
    padding: 20,
    paddingBottom: 8,
  },
  counterBox: {
    flex: 1,
    backgroundColor: '#1E2A3A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3A50',
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4F8EF7',
  },
  doneNumber: {
    color: '#4CD964',
  },
  counterLabel: {
    fontSize: 12,
    color: '#6B8FA8',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  list: {
    padding: 20,
    paddingTop: 12,
    gap: 12,
  },
  tarefaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A3A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3A50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tarefaCardDone: {
    opacity: 0.65,
    borderColor: '#4CD964',
  },
  tarefaCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: '#4CD964',
    borderColor: '#4CD964',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  tarefaContent: {
    flex: 1,
  },
  tarefaTitulo: {
    fontSize: 16,
    color: '#E8F0FE',
    fontWeight: '600',
    lineHeight: 22,
  },
  tarefaTituloDone: {
    textDecorationLine: 'line-through',
    color: '#6B8FA8',
  },
  tarefaStatus: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 4,
    fontWeight: '500',
  },
  detailBtn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnText: {
    fontSize: 26,
    color: '#4A5568',
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E8F0FE',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B8FA8',
    textAlign: 'center',
    lineHeight: 22,
  },
});
