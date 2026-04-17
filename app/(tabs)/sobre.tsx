import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import InfoCard from '@/src/components/InfoCard';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Hero */}
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>✅</Text>
          </View>
          <Text style={styles.appName}>GerenciaTask</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>v1.0.0</Text>
          </View>
          <Text style={styles.tagline}>Gerencie suas tarefas com simplicidade</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Informações do App */}
        <Text style={styles.sectionTitle}>📱 Informações do App</Text>
        <InfoCard icon="🏷️" label="Nome do Aplicativo" value="GerenciaTask" />
        <InfoCard icon="📦" label="Versão" value="1.0.0" />
        <InfoCard icon="⚡" label="Tecnologia" value="React Native + Expo" />
        <InfoCard icon="🗺️" label="Navegação" value="Expo Router (File-based)" />
        <InfoCard icon="🎨" label="Estilo" value="StyleSheet + Flexbox" />

        {/* Informações do Desenvolvedor */}
        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          👨‍💻 Desenvolvedor
        </Text>
        <InfoCard icon="🧑‍🎓" label="Desenvolvedor" value="Vitor de Souza" />
        <InfoCard icon="🏫" label="Disciplina" value="Desenvolvimento de Aplicações Móveis" />
        <InfoCard icon="📅" label="Ano" value="2026" />

        {/* Funcionalidades */}
        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          🚀 Funcionalidades
        </Text>
        <View style={styles.featureList}>
          {[
            '✅ Listar tarefas com FlatList',
            '✏️ Criar novas tarefas',
            '🔄 Marcar tarefas como concluídas',
            '🔗 Contexto global (useContext)',
            '🧭 Navegação por abas e pilha',
            '🗑️ Deletar tarefa na tela de detalhes',
            '🔍 Rota dinâmica /tarefa/[id]',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Feito com 💙 usando React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#1E2A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 46,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E8F0FE',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 14,
    color: '#6B8FA8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E2A3A',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E8F0FE',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  sectionTitleSpaced: {
    marginTop: 12,
  },
  featureList: {
    gap: 10,
    marginBottom: 16,
  },
  featureItem: {
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A3A50',
  },
  featureText: {
    fontSize: 14,
    color: '#B0C4D8',
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E2A3A',
  },
  footerText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
});
