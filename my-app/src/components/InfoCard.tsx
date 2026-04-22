import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoCardProps {
  icon: string;
  label: string;
  value: string;
}

export default function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A3A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2A3A50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    fontSize: 30,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6B8FA8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#E8F0FE',
    fontWeight: '700',
  },
});
