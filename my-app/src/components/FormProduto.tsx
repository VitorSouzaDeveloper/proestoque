import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema, ProdutoFormData } from '../schemas/produtoSchema';
import { Input } from './Input';
import { Button } from './Button';
import { ImagePickerField } from './ImagePickerField';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface FormProdutoProps {
  initialValues?: Partial<ProdutoFormData>;
  onSubmit: (data: ProdutoFormData) => void;
  submitButtonText?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const CATEGORIES = ['Bebidas', 'Alimentos', 'Limpeza', 'Higiene', 'Eletrônicos', 'Outros'] as const;
const QUICK_UNIDADES = ['un', 'cx', 'kg', 'L', 'pct'];
const QUICK_EMOJIS = ['📦', '☕', '💧', '🍚', '🧺', '🧴', '🔌', '🍏', '🍕'];

export function FormProduto({
  initialValues,
  onSubmit,
  submitButtonText = 'Salvar Produto',
  loading = false,
  children,
}: FormProdutoProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      categoria: 'Outros',
      quantidade: 0,
      estoqueMinimo: 0,
      unidade: 'un',
      preco: 0,
      emoji: '📦',
      foto: undefined,
      ...initialValues,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Foto do Produto */}
      <Controller
        control={control}
        name="foto"
        render={({ field: { value, onChange } }) => (
          <ImagePickerField
            value={value}
            onChange={onChange}
            error={errors.foto?.message}
          />
        )}
      />

      {/* 2. Nome do Produto */}
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome do Produto"
            placeholder="Ex: Arroz Integral 1kg"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.nome?.message}
            icon="cube-outline"
          />
        )}
      />

      {/* 3. Categoria */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Categoria</Text>
        <Controller
          control={control}
          name="categoria"
          render={({ field: { value, onChange } }) => (
            <View>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => {
                  const selected = cat === value;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryBtn,
                        selected && styles.categoryBtnSelected,
                      ]}
                      onPress={() => onChange(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryBtnText,
                          selected && styles.categoryBtnTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.categoria && (
                <Text style={styles.errorTextInline}>{errors.categoria.message}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* 4. Preço */}
      <Controller
        control={control}
        name="preco"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Preço Unitário (R$)"
            placeholder="0.00"
            keyboardType="decimal-pad"
            onBlur={onBlur}
            onChangeText={(text) => onChange(text === '' ? 0 : Number(text.replace(',', '.')))}
            value={value === 0 ? '' : String(value)}
            error={errors.preco?.message}
            icon="cash-outline"
          />
        )}
      />

      {/* 5. Quantidade e Estoque Mínimo */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Quantidade"
                placeholder="0"
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                value={value === 0 ? '0' : String(value)}
                error={errors.quantidade?.message}
                icon="layers-outline"
              />
            )}
          />
        </View>

        <View style={styles.col}>
          <Controller
            control={control}
            name="estoqueMinimo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Estoque Mínimo"
                placeholder="0"
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                value={value === 0 ? '0' : String(value)}
                error={errors.estoqueMinimo?.message}
                icon="alert-circle-outline"
              />
            )}
          />
        </View>
      </View>

      {/* 6. Unidade de Medida */}
      <View style={styles.section}>
        <Controller
          control={control}
          name="unidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Unidade de Medida"
                placeholder="Ex: un, cx, kg, L"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.unidade?.message}
                icon="options-outline"
              />
              <View style={styles.quickChipsRow}>
                {QUICK_UNIDADES.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.quickChip, value === u && styles.quickChipActive]}
                    onPress={() => setValue('unidade', u, { shouldValidate: true })}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quickChipText, value === u && styles.quickChipTextActive]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      </View>

      {/* 7. Emoji */}
      <View style={styles.section}>
        <Controller
          control={control}
          name="emoji"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Emoji Identificador"
                placeholder="Ex: 📦"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.emoji?.message}
                icon="happy-outline"
                maxLength={2}
              />
              <View style={styles.quickChipsRow}>
                {QUICK_EMOJIS.map((em) => (
                  <TouchableOpacity
                    key={em}
                    style={[styles.quickChip, value === em && styles.quickChipActive]}
                    onPress={() => setValue('emoji', em, { shouldValidate: true })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiChipText}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      </View>

      {/* Botão de Enviar */}
      <Button
        title={submitButtonText}
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.submitBtn}
      />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  col: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryBtn: {
    flexGrow: 1,
    flexBasis: '30%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryBtnText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryBtnTextSelected: {
    color: colors.textOnPrimary,
  },
  errorTextInline: {
    fontSize: typography.fontSize.xs,
    color: colors.borderError,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  quickChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  quickChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickChipTextActive: {
    color: colors.primary,
  },
  emojiChipText: {
    fontSize: typography.fontSize.md,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
