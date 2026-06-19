import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";
import { spacing, borderRadius, colors, shadows } from "@/src/constants/theme";

export function ProdutoSkeletonItem() {
  return (
    <View style={styles.item}>
      <Skeleton width={48} height={48} borderRadius={borderRadius.md} style={styles.thumbnail} />
      
      <View style={styles.info}>
        <Skeleton width="60%" height={16} style={styles.marginBottom} />
        <Skeleton width="40%" height={14} />
      </View>
      
      <Skeleton width={60} height={20} borderRadius={borderRadius.full} />
    </View>
  );
}

interface ProdutoListaSkeletonProps {
  count?: number;
}

export function ProdutoListaSkeleton({ count = 7 }: ProdutoListaSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProdutoSkeletonItem key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  thumbnail: {
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: spacing.xs,
  },
});
