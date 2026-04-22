import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/src/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>← preenchido na próxima aula →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  placeholder: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
