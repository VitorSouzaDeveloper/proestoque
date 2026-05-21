import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface ImagePickerFieldProps {
  value?: string;
  onChange: (uri?: string) => void;
  error?: string;
}

export function ImagePickerField({ value, onChange, error }: ImagePickerFieldProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos da permissão de acesso à galeria para adicionar uma foto do produto.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Quadrado é ideal para thumbnails de produtos
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Erro ao abrir image picker:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao abrir a galeria.');
    }
  };

  const removeImage = () => {
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto do Produto</Text>
      <View style={[styles.pickerContainer, error ? styles.pickerContainerError : undefined]}>
        {value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.previewImage} />
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.changeBtn]}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={16} color={colors.textOnPrimary} />
                <Text style={styles.actionBtnText}>Alterar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.removeBtn]}
                onPress={removeImage}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
                <Text style={[styles.actionBtnText, { color: colors.error }]}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.placeholderBtn}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <View style={styles.placeholderContent}>
              <Ionicons name="image-outline" size={36} color={colors.textMuted} />
              <Text style={styles.placeholderText}>Adicionar foto do produto</Text>
              <Text style={styles.placeholderSubtext}>Toque para selecionar na galeria</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.borderError} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    minHeight: 120,
  },
  pickerContainerError: {
    borderColor: colors.borderError,
    backgroundColor: colors.errorLight,
  },
  placeholderBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  placeholderSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  previewImage: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  actionsContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  changeBtn: {
    backgroundColor: colors.primary,
  },
  removeBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.borderError,
    fontWeight: '500',
  },
});
