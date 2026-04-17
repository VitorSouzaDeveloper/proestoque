import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F8EF7',
        tabBarInactiveTintColor: '#4A5568',
        tabBarStyle: {
          backgroundColor: '#0D1B2A',
          borderTopColor: '#1E2A3A',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#0D1B2A',
        },
        headerTintColor: '#E8F0FE',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-circle" color={color} size={size + 2} />
          ),
          headerTitle: '📋 GerenciaTask',
        }}
      />
      <Tabs.Screen
        name="nova"
        options={{
          title: 'Nova Tarefa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size + 2} />
          ),
          headerTitle: '✏️ Nova Tarefa',
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size + 2} />
          ),
          headerTitle: 'ℹ️ Sobre o App',
        }}
      />
      <Tabs.Screen
        name="tarefa/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
